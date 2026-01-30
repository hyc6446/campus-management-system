import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '@prisma/client';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '@modules/token/token.service';
import { RedisService } from '@core/redis/redis.service';
import { TokenPayload } from './jwt.strategy';
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception';
import { AUTH_CACHE_KEY } from '@app/common/constants/auth.constants';

/**
 * 认证服务类
 * 
 * 处理所有认证相关的业务逻辑，包括令牌生成、用户验证、
 * 密码加密和用户注销等功能。
 */
@Injectable()
export class AuthService {
  /**
   * 构造函数
   * @param jwtService JWT服务，用于生成和验证令牌
   * @param configService 配置服务，用于获取认证相关配置
   * @param userRepository 用户仓库，用于用户数据操作
   * @param tokenService 令牌服务，用于令牌数据操作
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 生成访问令牌和刷新令牌
   * 
   * 根据用户信息生成两个JWT令牌：
   * - accessToken：短期有效，用于API访问认证
   * - refreshToken：长期有效，用于刷新accessToken
   * 
   * @param user 用户对象，包含生成令牌所需的用户信息
   * @returns 包含accessToken和refreshToken的对象
   */
  async generateTokens(user: any) {
    // 构建JWT令牌载荷，包含用户唯一标识、邮箱和角色信息
    const payload: TokenPayload = { 
      sub: user.id.toString(),      // 用户ID，JWT标准主题字段
      email: user.email, // 用户邮箱，用于身份标识
      role: user.role.name,   // 用户角色，用于权限控制
    };
    const auth = this.configService.get('auth')
    // 并行生成访问令牌和刷新令牌，提高性能
    const [accessToken, refreshToken] = await Promise.all([
      // 生成访问令牌，使用JWT密钥并设置较短的过期时间
      this.jwtService.signAsync(payload, {
        secret: auth.jwtSecret,
        expiresIn: auth.jwtExpiresIn,
      }),
      // 生成刷新令牌，使用专门的刷新令牌密钥并设置较长的过期时间
      this.jwtService.signAsync(payload, {
        secret: auth.jwtRefreshSecret,
        expiresIn: auth.jwtRefreshExpiresIn,
      }),
    ]);

    // 将刷新令牌保存到数据库，用于后续的令牌验证和吊销
    const refreshTokenEntity = await this.tokenService.create({
      userId: user.id,
      token: refreshToken,
      type: TokenType.REFRESH,
      expiresAt: new Date(Date.now() + parseInt(auth.jwtRefreshExpiresIn as string)),
    });
    // 返回生成的两个令牌
    return {
      accessToken,
      refreshToken,
      ...refreshTokenEntity,
    };
  }

  /**
   * 验证用户凭据
   * 
   * 根据提供的邮箱和密码验证用户身份，验证成功返回用户对象，
   * 验证失败返回null。此方法不直接抛出异常，便于在控制器中根据
   * 返回值灵活处理不同的错误情况。
   * 
   * @param email 邮箱地址
   * @param password 明文密码
   * @returns 验证成功返回用户对象，失败返回null
   */
  async validateUser(email: string, password: string):  Promise<pt.USER_FULL_ROLE_DEFAULT_TYPE | null> {
    // 1.根据邮箱查找用户
    const user = await this.userService.findByEmailFullForLogin(email);
    // 2.检查用户是否存在
    if (!user || user.deletedAt){
      throw new AppException('用户不存在','USER_NOT_FOUND',HttpStatus.NOT_FOUND);
    };
    // 3.检查用户状态是否为激活
    if (user.deletedAt) {
      throw new AppException('用户状态异常','USER_STATUS_ERROR',HttpStatus.GONE);
    }
    // 4.检查用户是否被锁定
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new AppException('该账号已被锁定','USER_LOCKED',HttpStatus.LOCKED);
    }
    
    // 5.如果账户曾经被锁定但现在已经过期，自动解锁
    if (user.lockUntil && user.lockUntil <= new Date()) {
      await this.userService.resetFailedLoginAttempts(user.id);
    }
    
    // 6.使用bcrypt比较明文密码与存储的哈希密码是否匹配
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // 6.1增加失败登录尝试次数
      const failUser = await this.userService.incrementFailedLoginAttempts(user.id);
      if (!failUser)  return null;
      
      // 6.2检查更新后的用户是否超过最大失败尝试次数，若超过则锁定用户
      if (failUser && failUser.failedLoginAttempts >= this.configService.get('auth.maxLoginAttempts')) {
        await this.userService.lockUser(failUser.id);
        throw new AppException('该账号已被锁定','USER_LOCKED',HttpStatus.LOCKED);
      }
      
      return null;
    }
    
    // 7.密码验证成功，重置失败登录尝试次数
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      await this.userService.resetFailedLoginAttempts(user.id);
    }
    
    return user;
  }

  /**
   * 验证刷新令牌
   * 
   * 验证刷新令牌的有效性，检查令牌是否与数据库中存储的一致。
   * 验证失败直接抛出UnauthorizedException异常。
   * 
   * @param userId 用户ID
   * @param refreshToken 待验证的刷新令牌
   * @returns 验证成功的用户对象
   * @throws UnauthorizedException 当令牌无效或用户不存在时抛出
   */
  async validateRefreshToken(refreshToken: string,) {
    // 1.解析刷新令牌载荷
    const payload = await this.parseRefreshTokenPayload(refreshToken);

    // 2.根据用户ID查找用户
    const user = await this.userService.findById(Number(payload.sub));
    
    // 3.检查用户是否存在
    if (!user) {
      throw new AppException('无效的用户','INVALID_USER',HttpStatus.NOT_FOUND);
    }

    // 4.检查缓存中是否存在该Token
    const cacheToken = await this.redisService.hget(AUTH_CACHE_KEY(user.id), 'token');
    if (cacheToken !== refreshToken) {
      throw new AppException('无效的刷新令牌','INVALID_REFRESH_TOKEN',HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  /**
   * 加密密码
   * 
   * 使用bcrypt算法对明文密码进行哈希加密，防止密码明文存储。
   * 从配置中获取盐值轮数，确保密码安全性。
   * 
   * @param password 明文密码
   * @returns 加密后的密码哈希字符串
   */
  async hashPassword(password: string): Promise<string> {
    // 从配置中获取bcrypt盐值轮数
    const saltRounds = this.configService.get('auth.bcryptSaltRounds');
    // 使用指定的盐值轮数对密码进行哈希
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * 解析刷新令牌的载荷数据
   * 
   * 验证并解析刷新令牌，获取其中的用户信息载荷。
   * 此方法主要用于需要从令牌中提取信息的场景。
   * 
   * @param refreshToken 刷新令牌
   * @returns 令牌载荷数据
   * @throws UnauthorizedException 当令牌无效或过期时抛出
   */
  async parseRefreshTokenPayload(refreshToken: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync(
        refreshToken,
        { secret: this.configService.get('auth.jwtRefreshSecret') }
      ) as TokenPayload;

    } catch (error) {
      throw new AppException('无效或过期的刷新令牌','INVALID_REFRESH_TOKEN',HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * 用户注销
   * 
   * 通过清除用户的刷新令牌实现注销功能，使之前颁发的刷新令牌失效。
   * 这样即使用户的令牌尚未过期，也无法再使用它刷新访问令牌。
   * 
   * @param userId 用户ID
   */
  async logout(userId: number): Promise<boolean> {
    // 将用户的刷新令牌设置为null，表示令牌已被吊销
    return await this.tokenService.logout(userId);
  }
}
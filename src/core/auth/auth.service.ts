import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '@prisma/client';
import { UserService } from '@modules/user/user.service';
import { TokenService } from '@modules/token/token.service';
import { User } from '@modules/user/entities/user.entity';
import { TokenPayload } from './jwt.strategy';
// import { UserSelectType,UserSelect } from '@common/types/entity/user.type';


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
  //todo
  async generateTokens(user: any) {
    // 构建JWT令牌载荷，包含用户唯一标识、邮箱和角色信息
    const payload: TokenPayload = { 
      sub: user.id.toString(),      // 用户ID，JWT标准主题字段
      email: user.email, // 用户邮箱，用于身份标识
      role: user.role.name,   // 用户角色，用于权限控制
    };
    
    // 并行生成访问令牌和刷新令牌，提高性能
    const [accessToken, refreshToken] = await Promise.all([
      // 生成访问令牌，使用JWT密钥并设置较短的过期时间
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('auth.jwtSecret'),
        expiresIn: this.configService.get('auth.jwtExpiresIn'),
      }),
      // 生成刷新令牌，使用专门的刷新令牌密钥并设置较长的过期时间
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('auth.jwtRefreshSecret'),
        expiresIn: this.configService.get('auth.jwtRefreshExpiresIn'),
      }),
    ]);

    // 将刷新令牌保存到数据库，用于后续的令牌验证和吊销
    const refreshTokenEntity = await this.tokenService.createRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + parseInt(this.configService.get('auth.jwtRefreshExpiresIn') as string)),
    );
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
  async validateUser(email: string, password: string):  Promise<User | null> {
    // 根据邮箱查找用户
    const user:any = await this.userService.findByEmailOptional(email);
    // 检查用户是否存在且状态为激活
    if (!user || user.deletedAt) return null;
    
    // 检查用户是否被锁定
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedException('账号已被锁定');
    }
    
    // 如果账户曾经被锁定但现在已经过期，自动解锁
    if (user.lockUntil && user.lockUntil <= new Date()) {
      await this.userService.resetFailedLoginAttempts(user.id);
    }
    
    // 使用bcrypt比较明文密码与存储的哈希密码是否匹配
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // 增加失败登录尝试次数
      const updatedUser = await this.userService.incrementFailedLoginAttempts(user.id);
      if (!updatedUser)  return null;
      
      // 检查更新后的用户是否超过最大失败尝试次数，若超过则锁定用户
      if (updatedUser && updatedUser.failedLoginAttempts >= this.configService.get('auth.maxLoginAttempts')) {
        await this.userService.lockUser(updatedUser.id);
      }
      
      // 密码验证失败，返回null
      return null;
    }
    
    // 密码验证成功，重置失败登录尝试次数
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      await this.userService.resetFailedLoginAttempts(user.id);
    }
    
    // 验证成功，返回用户对象
    return user as User;
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
    // 解析刷新令牌载荷
    const payload = await this.parseRefreshTokenPayload(refreshToken);
    console.log('刷新令牌payload',payload);

    // 根据用户ID查找用户
    const user = await this.userService.findById(Number(payload.sub));
    
    // 检查用户是否存在
    if (!user) {
      throw new UnauthorizedException('无效的用户');
    }
    const token = await this.tokenService.findByUserIdAndType(user.id, TokenType.REFRESH);
    // 验证刷新令牌是否与数据库中存储的一致
    if (token?.token !== refreshToken) {
      throw new UnauthorizedException('无效的刷新令牌');
    }
    // 返回用户对象（Token表的验证逻辑已在其他地方处理）
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
      throw new UnauthorizedException('无效或过期的刷新令牌');
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
  async logout(userId: number): Promise<void> {
    // 将用户的刷新令牌设置为null，表示令牌已被吊销
    await this.tokenService.deleteByUserIdAndType(userId, TokenType.REFRESH);
  }
}
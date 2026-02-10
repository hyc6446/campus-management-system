import { PinoLogger } from 'nestjs-pino'
import { Injectable, HttpStatus } from '@nestjs/common'
import { UserService } from '@app/modules/user/user.service'
import { RoleService } from '@app/modules/role/role.service'
import { AuthService as CoreAuthService } from '@app/core/auth/auth.service'
import { RedisService } from '@core/redis/redis.service'
import { LoginDto, RegisterDto } from '@app/modules/auth/dto'
import { AppException } from '@app/common/exceptions/app.exception'
import { ConfigService } from '@nestjs/config'
import { AUTH_CACHE_KEY } from '@app/common/constants/auth.constants'
import { AUTH_STREAM_KEY } from '@app/common/constants/redis.constants'
import * as pt from'@app/common/prisma-types'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly coreAuthService: CoreAuthService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger
  ) {}

  /**
   * 处理用户登录
   * @param loginDto 登录数据
   * @returns 令牌和用户信息
   * @throws UnauthorizedException 无效凭据
   */
  async login(loginDto: LoginDto) {
    // 1.检查是否为默认账户
    if (loginDto.email === 'anonymous@example.com') {
      throw new AppException('非法用户', 'UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }
    // 2.验证用户凭据
    const user = await this.coreAuthService.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new AppException('无效的邮箱或密码', 'UNAUTHORIZED', HttpStatus.UNAUTHORIZED)
    }
    const { accessToken, refreshToken } = await this.coreAuthService.generateTokens(user)

    // 3.缓存用户的refreshToken
    try {
      const expiresAt = new Date(Date.now() + this.configService.get('auth.jwtRefreshExpiresIn'))
      await this.redisService.hset(AUTH_CACHE_KEY(user.id), 'token', refreshToken)
      await this.redisService.hset(AUTH_CACHE_KEY(user.id), 'expiresAt', expiresAt.toISOString())
      await this.redisService.expire(AUTH_CACHE_KEY(user.id), 7 * 24 * 60 * 60)
    } catch (error) {
      this.logger.warn('Redis缓存失败，但不影响登录:', error)
    }

    // 返回用户信息(过滤敏感字段)
    const safeUser = await this.userService.getSafeUser(user)

    // 异步添加登录事件，不阻塞登录流程
    this.redisService.xadd(AUTH_STREAM_KEY, '*', {
      event: 'login',
      data: `用户 ${user.userName} 登录成功`,
    })

    return { accessToken, refreshToken, user: safeUser }
  }

  /**
   * 处理用户注册
   * @param registerDto 注册数据
   * @returns 创建的用户
   * @throws ConflictException 邮箱已存在
   */
  async register(registerDto: RegisterDto): Promise<pt.SAFE_USER_TYPE> {
    // 检查邮箱是否已存在
    const existingUser = await this.userService.findByEmailOptional(registerDto.email)
    if (existingUser) {
      throw new AppException('该邮箱已被注册', 'CONFLICT', HttpStatus.CONFLICT, {
        email: registerDto.email,
      })
    }

    // 查找角色
    const role = await this.roleService.findByNameOptional(registerDto.role)
    if (!role) {
      throw new AppException('角色不存在', 'Role_NOT_FOUND', HttpStatus.BAD_REQUEST, {
        role: registerDto.role,
      })
    }

    // 创建新用户
    return await this.userService.create({
      email: registerDto.email,
      password: await this.coreAuthService.hashPassword(registerDto.password),
      userName: registerDto.username,
      roleId: role.id,
    })
  }

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌
   * @throws UnauthorizedException 无效令牌
   */
  // TODO: 实现刷新令牌逻辑
  async refreshToken(refreshToken: string) {
    // try {
    //   // 1. 验证用户和令牌是否匹配
    //   const user: UserWithFields<UserSelect> = await this.coreAuthService.validateRefreshToken(refreshToken);
    //   // 3. 生成新的访问令牌
    //   const accessToken = await this.coreAuthService.generateTokens(user);
    //   return accessToken;
    // } catch (error) {
    //   throw new UnauthorizedException('无效或过期的刷新令牌');
    // }
  }
}

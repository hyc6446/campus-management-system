import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { RoleService } from '@modules/role/role.service';
import { AuthService as CoreAuthService } from '@core/auth/auth.service';
import { LoginDto, RegisterDto } from './dto/index';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly coreAuthService: CoreAuthService,
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
      throw new UnauthorizedException('无效的邮箱');
    }
    // 2.验证用户凭据
    const user = await this.coreAuthService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    console.log("服务层 验证用户凭据 结果:", user)

    if (!user) {
      throw new UnauthorizedException('无效的邮箱或密码');
    }
    
    const { accessToken, refreshToken } = await this.coreAuthService.generateTokens(user);
    
    // 返回用户信息(过滤敏感字段)
    const safeUser = await this.userService.getSafeUser(user);
    console.log("服务层 登录 返回过滤敏感字段用户信息:", safeUser)
    return {
      accessToken,
      refreshToken,
      ...safeUser,
    };
  }

  /**
   * 处理用户注册
   * @param registerDto 注册数据
   * @returns 创建的用户
   * @throws ConflictException 邮箱已存在
   */
  async register(registerDto: RegisterDto) {
    // 检查邮箱是否已存在
    const existingUser = await this.userService.findByEmailOptional(registerDto.email);
    if (existingUser) {
      throw new ConflictException('该邮箱已被注册');
    }

    // 查找角色
    const role = await this.roleService.findByNameOptional(registerDto.role);
    if (!role) {
      throw new ConflictException('无效的角色');
    }

    // 创建新用户
    const user = await this.userService.create({
      email: registerDto.email,
      password: await this.coreAuthService.hashPassword(registerDto.password),
      userName: registerDto.username,
      roleId: role.id,
      isActive: true,
    });
    console.log('创建新用户user',user);
    return user;
  }

  /**
   * 刷新访问令牌
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌
   * @throws UnauthorizedException 无效令牌
   */
  async refreshToken(refreshToken: string) {
    // try {
    //   // 1. 验证用户和令牌是否匹配
    //   const user: UserWithFields<UserSelect> = await this.coreAuthService.validateRefreshToken(refreshToken);
    //   // 3. 生成新的访问令牌
    //   const accessToken = await this.coreAuthService.generateTokens(user);
    //   console.log('刷新访问令牌accessToken',accessToken);
    //   return accessToken;
    // } catch (error) {
    //   throw new UnauthorizedException('无效或过期的刷新令牌');
    // }
  }
}
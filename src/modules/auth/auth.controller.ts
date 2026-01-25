import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Controller, Post, Body, HttpStatus, UseInterceptors } from '@nestjs/common'
import { AuthService } from '@app/modules/auth/auth.service'
// import { AuditLog } from '@app/common/decorators/audit-log.decorator'
import { PublicAuth } from '@app/common/decorators/public-auth.decorator'
import { LoginDto, RegisterDto, RefreshTokenDto } from '@app/modules/auth/dto/index'


@ApiTags('认证')
@Controller('auth')
@PublicAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) { }

  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功登录' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '无效的凭据' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '用户不存在' })

  @Post('login')
  // @AuditLog({ 
  //   action: 'login', 
  //   resource: 'User',
  //   resourceIdPath: 'data.data.user.id',
  //   userIdPath: 'data.data.user.id',
  // })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }

  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: HttpStatus.OK, description: '注册成功' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '该用户已存在' })
  @Post('register')
  // @AuditLog({ 
  //   action: 'register', 
  //   resource: 'User',
  //   resourceIdPath: 'data.data.id',
  //   userIdPath: 'data.data.id',
  // })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponse({ status: HttpStatus.OK, description: '令牌刷新成功' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '无效或过期的刷新令牌' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '刷新令牌不存在' })
  @Post('refresh')
  // @AuditLog({
  //   action: 'refreshToken',
  //   resource: 'Token',
  //   resourceIdPath: 'data.data.id',
  //   userIdPath: 'data.data.userId',
  // })
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.refreshToken)
  }
}
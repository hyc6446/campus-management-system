import {Controller,Post,Body,UsePipes} from '@nestjs/common'
import { ZodValidationPipe } from '@common/pipes/validation.pipe'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { AuthService } from '@modules/auth/auth.service'

import {
  LoginDto,
  LoginSchema,
  LoginDtoSwagger,
  RegisterDto,
  RegisterSchema,
  RegisterDtoSwagger,
  RefreshDto,
  RefreshTokenSchema,
  RefreshDtoSwagger,
} from '@modules/auth/dto/index'
import { AuditLog } from '@app/common/decorators/audit-log.decorator'
import { PublicAuth } from '@app/common/decorators/public-auth.decorator'

@ApiTags('认证')
@Controller('auth')
@PublicAuth()
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDtoSwagger })
  @ApiResponse({
    status: 200,
    description: '成功登录',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 123,
          email: 'user@example.com',
          name: '张三',
          role: 'STUDENT',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '无效的凭据' })
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  @AuditLog({ 
    action: 'login', 
    resource: 'User',
    resourceIdPath: 'data.data.user.id',
    userIdPath: 'data.data.user.id',
  })
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto)
    return result
  }

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: RegisterDtoSwagger })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    schema: {
      example: {
        id: 123,
        email: 'user@example.com',
        name: '张三',
        role: 'STUDENT',
        createdAt: '2023-08-22T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: '无效的输入数据' })
  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  @AuditLog({ 
    action: 'register', 
    resource: 'User',
    resourceIdPath: 'data.data.id',
    userIdPath: 'data.data.id',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiBody({ type: RefreshDtoSwagger })
  @ApiResponse({
    status: 200,
    description: '令牌刷新成功',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: '无效或过期的刷新令牌' })
  @Post('refresh')
  @UsePipes(new ZodValidationPipe(RefreshTokenSchema))
  @AuditLog({ 
    action: 'refreshToken', 
    resource: 'Token',
    resourceIdPath: 'data.data.id',
    userIdPath: 'data.data.userId',
  })
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refreshToken(refreshDto.refreshToken)
  }
}
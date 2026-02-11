import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { Controller, Post, Body, HttpStatus, UseInterceptors, HttpCode } from '@nestjs/common'
import { AuthService } from '@app/modules/auth/auth.service'
import { PublicAuth } from '@app/common/decorators/public-auth.decorator'
import {
  ApiOk,
  ApiCreated,
  ApiResponses,
  ApiBadRequest,
  ApiConflict,
} from '@app/common/decorators/api-responses.decorator'
import {
  LoginDto,
  LoginResDto,
  RegisterDto,
  RegResDto,
  RefreshTokenDto,
} from '@app/modules/auth/dto/index'

@ApiTags('认证')
@Controller('auth')
@PublicAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @ApiOk(LoginResDto)
  @ApiResponses({ noAuth: true, locked: true, notFound: true, gone: true })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @ApiOperation({ summary: '用户注册' })
  @ApiCreated(RegResDto)
  @ApiBadRequest()
  @ApiConflict()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @ApiOperation({ summary: '刷新访问令牌' })
  @ApiResponse({ status: HttpStatus.OK, description: '令牌刷新成功' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '无效或过期的刷新令牌' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '刷新令牌不存在' })
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshDto.refreshToken)
  }
}

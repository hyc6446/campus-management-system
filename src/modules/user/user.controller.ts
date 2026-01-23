import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { AuditLog } from '@common/decorators/audit-log.decorator'
import { ZodValidationPipe } from '@common/pipes/validation.pipe'
import { AuthGuard } from '@common/guards/auth.guard'
import { File } from '@common/types/file.types'
import { UserService } from './user.service'
import { User } from './user.entity'
import {
  CreateUserDto,
  UpdateUserDto,
  UserProfileDto,
  UserProfileSchema,
  CreateUserSchema,
  UpdateUserSchema,
  UserProfileDtoSwagger,
  CreateUserDtoSwagger,
  UpdateUserDtoSwagger,
} from './dto/index'
import * as pt from '@app/common/prisma-types'

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取当前登录用户信息' })
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, description: '成功获取用户信息', type: User })
  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    return this.userService.getSafeUser(user)
  }

  @ApiOperation({ summary: '更新个人资料' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UserProfileDtoSwagger })
  @ApiResponse({ status: 200, description: '资料更新成功', type: User })
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  // @AuditLog({
  //   action: 'update',
  //   resource: 'User',
  //   resourceIdPath: '0.id',
  //   logParams: true,
  //   logResult: true,
  // })
  @Put('profile')
  updateProfile(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(UserProfileSchema)) profileDto: UserProfileDto,
    @UploadedFile() avatar?: File
  ) {
    return this.userService.updateProfile(user.id, { ...profileDto, avatar })
  }

  @ApiOperation({ summary: '获取用户列表 (管理员)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量', example: 10 })
  @ApiResponse({ status: 200, description: '成功获取用户列表', type: User, isArray: true })
  @ApiResponse({ status: 403, description: '无权限' })
  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() currentUser: User
  ) {
    return await this.userService.findAll(page, limit, currentUser)
  }

  @ApiOperation({ summary: '创建新用户 (管理员)' })
  @ApiBody({ type: CreateUserDtoSwagger })
  @ApiResponse({ status: 201, description: '用户创建成功', type: User })
  @ApiResponse({ status: 403, description: '无权限' })
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body(new ZodValidationPipe(CreateUserSchema)) createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto)
  }

  @ApiOperation({ summary: '获取指定用户信息' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiResponse({ status: 200, description: '成功获取用户信息', type: User })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @ApiResponse({ status: 403, description: '无权限' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    const user = await this.userService.findById(id)
    return user
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiBody({ type: UpdateUserDtoSwagger })
  @ApiResponse({ status: 200, description: '用户更新成功', type: User })
  @ApiResponse({ status: 403, description: '无权限' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body(new ZodValidationPipe(UpdateUserSchema)) updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User
  ) {
    return await this.userService.update(id, updateUserDto, currentUser)
  }

  @ApiOperation({ summary: '删除用户 (管理员)' })
  @ApiParam({ name: 'id', description: '用户ID', type: Number })
  @ApiResponse({ status: 204, description: '用户删除成功' })
  @ApiResponse({ status: 403, description: '无权限' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() currentUser: User) {
    await this.userService.delete(id, currentUser)
    return { success: true }
  }
}

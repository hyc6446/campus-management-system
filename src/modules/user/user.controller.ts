import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { ApiOk, ApiCreated, ApiResponses } from '@app/common/decorators/api-responses.decorator'
import { AuthGuard } from '@common/guards/auth.guard'
import { UserService } from './user.service'
import { User } from './user.entity'
import { CreateDto, UpdateDto, QueryDto } from './dto/index'
// import { Roles } from '@app/common/decorators/roles.decorator'
// import { RoleType } from '../role/role.entity'
import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common'

@ApiTags('用户管理')
@Controller('users')
// @Roles(RoleType.ADMIN)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取用户列表',
    type: User,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.userService.findAll(query)
  }

  @ApiOperation({ summary: '获取用户详情' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取用户信息', type: User })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findById(id)
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '用户更新成功', type: User })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' })
  @Put()
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: UpdateDto) {
    return await this.userService.update(id, updateData)
  }

  @ApiOperation({ summary: '停用用户' })
  @ApiResponse({ status: HttpStatus.OK, description: '用户停用成功' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' })
  @Delete()
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.delete(id)
  }

  @ApiOperation({ summary: '批量删除用户' })
  @ApiResponse({ status: HttpStatus.OK, description: '用户批量删除成功' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' })
  @Delete('many')
  async deleteMany(@Body('ids') ids: string) {
    return await this.userService.deleteMany(ids)
  }

  @ApiOperation({ summary: '激活用户' })
  @ApiResponse({ status: HttpStatus.OK, description: '用户激活成功' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' })
  @Put(':id/activate')
  async activate(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.activate(id)
  }

  @ApiOperation({ summary: '批量激活用户' })
  @ApiResponse({ status: HttpStatus.OK, description: '用户批量激活成功' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数错误' })
  @Put('many/activate')
  async activateMany(@Body('ids') ids: string) {
    return await this.userService.activateMany(ids)
  }
}

import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { Role, RoleType } from '@app/modules/role/role.entity'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { RoleService } from './role.service'
import * as pt from '@app/common/prisma-types'
import { UpdateRoleDto, CreateRoleDto, QueryRoleDto } from './dto/index'
import {
  Controller,
  Post,
  Param,
  Get,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common'

@ApiTags('角色')
@Controller('role')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: '查询角色' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取角色列表',
    type: Role,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Read })
  @Get('query')
  async findAll(@Query() query: QueryRoleDto) {
    return await this.roleService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定角色信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取角色信息', type: Role })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Read })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.findByIdWithFull(id)
  }

  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: HttpStatus.OK, description: '角色创建成功', type: Role })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '角色名称已存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Create })
  @Post()
  async create(@Body() createData: CreateRoleDto) {
    return await this.roleService.create(createData)
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiResponse({ status: HttpStatus.OK, description: '角色更新成功', type: Role })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '角色名称已存在' })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: UpdateRoleDto) {
    return await this.roleService.update(id, updateData)
  }

  @ApiOperation({ summary: '停用角色' })
  @ApiResponse({ status: HttpStatus.OK, description: '角色删除成功' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Delete })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id)
  }

  @ApiOperation({ summary: '恢复角色' })
  @ApiResponse({ status: HttpStatus.OK, description: '角色恢复成功' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Restore })
  @Post(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.restore(id)
  }
}

import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { Permission } from '@app/modules/permission/permission.entity'
import { RoleType } from '@app/modules/role/role.entity'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { PermissionService } from '@app/modules/permission/permission.service'
import {
  CreatePermissionDto,
  QueryPermissionDto,
  UpdatePermissionDto,
} from '@app/modules/permission/dto'
import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  Get,
  UseGuards,
  Query,
  Put,
  UseInterceptors,
} from '@nestjs/common'

@ApiTags('权限')
@Controller('permission')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @ApiOperation({ summary: '查询权限' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取权限列表',
    type: Permission,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Permission })
  @Get()
  async findAll(@Query() query: QueryPermissionDto) {
    return await this.permissionService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定权限信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取权限信息', type: Permission })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Permission })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.findById(id)
  }

  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '权限创建成功', type: Permission })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Permission })
  @Post()
  async create(@Body() createData: CreatePermissionDto) {
    return await this.permissionService.create(createData)
  }
  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({ status: HttpStatus.OK, description: '权限更新成功', type: Permission })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Permission })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdatePermissionDto) {
    return await this.permissionService.update(id, updatedata)
  }

  @ApiOperation({ summary: '停用权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '权限删除成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Permission })
  @Post(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.delete(id)
  }

  @ApiOperation({ summary: '恢复权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '权限恢复成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Permission })
  @Post(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.restore(id)
  }
}

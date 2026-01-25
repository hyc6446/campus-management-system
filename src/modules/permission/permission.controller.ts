import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permission } from '@app/modules/permission/permission.entity'
import { RoleType } from '@app/modules/role/role.entity'
import { PermissionService } from '@app/modules/permission/permission.service'
// import * as pt from '@app/common/prisma-types'
import { CreatePermissionDto, QueryPermissionDto, UpdatePermissionDto } from '@app/modules/permission/dto'
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
} from '@nestjs/common'



@ApiTags('权限')
@Controller('permission')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(private permissionService: PermissionService) { }

  @ApiOperation({ summary: '查询权限' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取权限列表', type: Permission, isArray: true, })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Get()
  async findAll(@Query() query: QueryPermissionDto) {
    console.log("query===", query)
    return await this.permissionService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定权限信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取权限信息', type: Permission })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.findById(id)
  }

  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '权限创建成功', type: Permission })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.ADMIN)
  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto)
  }

  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({ status: HttpStatus.OK, description: '权限更新成功', type: Permission })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @Roles(RoleType.ADMIN)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionService.update(id, updatePermissionDto)
  }

  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '权限删除成功' })
  @Roles(RoleType.ADMIN)
  @Post(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.delete(id)
  }
}

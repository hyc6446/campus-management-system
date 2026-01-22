
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { ZodValidationPipe } from '@app/common/pipes/validation.pipe'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import { Roles } from '@app/common/decorators/roles.decorator'
import { PermissionService } from './permission.service'
import { Permission } from './entities/permission.entity'
import { RoleType } from '../role/entities/role.entity'
import * as all from '@app/common/prisma-types'

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger'
import {
  CreatePermissionDto,
  CreatePermissionDtoSwagger,
  CreatePermissionSchema,
  QueryPermissionSchema,
  QueryPermissionDto,
  UpdatePermissionDto,
  UpdatePermissionDtoSwagger,
  UpdatePermissionSchema,
} from './dto/index'
import {
  Controller,
  Post,
  Body,
  UsePipes,
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
  constructor(private permissionService: PermissionService) {}

  @ApiOperation({ summary: '查询权限' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 })
  @ApiQuery({name: 'limit',required: false,type: Number,description: '每页数量(最大100)',example: 10,maximum: 100})
  @ApiQuery({ name: 'id', required: false, type: Number, description: '权限ID', example: 1 })
  @ApiQuery({ name: 'action', required: false, type: String, description: '操作', example: '' })
  @ApiQuery({ name: 'subject', required: false, type: String, description: '主题', example: '' })
  @ApiQuery({ name: 'roleId', required: false, type: Number, description: '角色ID', example: 1 })
  @ApiQuery({name: 'createdAt',required: false,type: String,description: '创建时间',example: ''})
  @ApiQuery({name: 'sortBy',required: false,type: String,description: '排序字段, 多个字段用逗号分隔',example: 'createdAt'})
  @ApiQuery({name: 'order',required: false,type: String,description: '排序方式, 多个字段用逗号分隔',example: 'desc' })
  @ApiResponse({status: HttpStatus.OK,description: '成功获取权限列表',type: Permission,isArray: true,})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)  
  @Get('query')
  async findAll(
    @Query(new ZodValidationPipe(QueryPermissionSchema)) query: QueryPermissionDto,
    @CurrentUser() currentUser: all.USER_SAFE_ROLE_DEFAULT_TYPE
  ) {
    return await this.permissionService.findAll(query, currentUser)
  }

  @ApiOperation({ summary: '创建权限' })
  @ApiBody({ type: CreatePermissionDtoSwagger })
  @ApiResponse({ status: HttpStatus.CREATED, description: '权限创建成功', type: Permission })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.ADMIN)
  @Post()
  @UsePipes(new ZodValidationPipe(CreatePermissionSchema))
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto)
  }

  @ApiOperation({ summary: '获取指定权限信息' })
  @ApiParam({ name: 'id', description: '权限ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取权限信息', type: Permission })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.findById(id)
  }

  @ApiOperation({ summary: '更新权限' })
  @ApiParam({ name: 'id', description: '权限ID', type: Number })
  @ApiBody({ type: UpdatePermissionDtoSwagger })
  @ApiResponse({ status: HttpStatus.OK, description: '权限更新成功', type: Permission })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @Roles(RoleType.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdatePermissionSchema)) updatePermissionDto: UpdatePermissionDto
  ) {
    return await this.permissionService.update(id, updatePermissionDto)
  }

  @ApiOperation({ summary: '删除权限' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '权限ID', type: Number })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该权限不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '权限删除成功' })
  @Roles(RoleType.ADMIN)
  @Post('delete')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.delete(id)
  }
}

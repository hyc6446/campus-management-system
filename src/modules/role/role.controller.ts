import { AuthGuard } from '@common/guards/auth.guard'
import { ZodValidationPipe } from '@common/pipes/validation.pipe'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { RoleService } from './role.service'
import { Role } from './entities/role.entity'
import * as all from '@app/common/prisma-types'
import {
  UpdateRoleDtoSwagger,
  CreateRoleDtoSwagger,
  QueryRoleSchema,
  UpdateRoleSchema,
  CreateRoleSchema,
  UpdateRoleDto,
  CreateRoleDto,
  QueryRoleDto,
} from './dto/index'
import {
  Controller,
  Post,
  Param,
  Get,
  Put,
  Delete,
  Body,
  Query,
  UsePipes,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery} from '@nestjs/swagger'

@ApiTags('角色')
@Controller('role')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: '查询角色' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量(最大100)', example: 10, maximum: 100 })
  @ApiQuery({ name: 'id', required: false, type: Number, description: '角色ID', example: 1 })
  @ApiQuery({ name: 'name', required: false, type: String, description: '角色名称', example: '' })
  @ApiQuery({ name: 'createdAt', required: false, type: String, description: '创建时间', example: '' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: '排序字段, 多个字段用逗号分隔', example: 'createdAt' })
  @ApiQuery({ name: 'order', required: false, type: String, description: '排序方式, 多个字段用逗号分隔', example: 'desc' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取角色列表', type: Role, isArray: true, })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @Get('query')
  async findAll(
    @Query(new ZodValidationPipe(QueryRoleSchema)) query: QueryRoleDto,
    @CurrentUser() currentUser: all.USER_SAFE_ROLE_DEFAULT_TYPE) {
    return await this.roleService.findAll(query, currentUser)
  }

  @ApiOperation({ summary: '创建角色' })
  @ApiBody({ type: CreateRoleDtoSwagger })
  @ApiResponse({ status: HttpStatus.OK, description: '角色创建成功', type: Role })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '角色名称已存在' })
  @Post()
  @UsePipes(new ZodValidationPipe(CreateRoleSchema))
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto)
  }

  @ApiOperation({ summary: '获取指定角色信息' })
  @ApiParam({ name: 'id', description: '角色ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取角色信息', type: Role })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.findByIdWithFull(id)
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiParam({ name: 'id', description: '角色ID', type: Number })
  @ApiBody({ type: UpdateRoleDtoSwagger })
  @ApiResponse({ status: HttpStatus.OK, description: '角色更新成功', type: Role })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '角色名称已存在' })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdateRoleSchema)) updateRoleDto: UpdateRoleDto,
    @CurrentUser() currentUser: all.USER_SAFE_ROLE_DEFAULT_TYPE
  ) {
    return await this.roleService.update(id, updateRoleDto, currentUser)
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '角色删除成功' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: all.USER_SAFE_ROLE_DEFAULT_TYPE) {
    return this.roleService.delete(id, currentUser)
  }
}

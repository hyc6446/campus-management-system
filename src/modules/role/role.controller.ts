import {
  Controller,
  Post,
  Body,
  UsePipes,
  Param,
  Get,
  UseGuards,
  Query,
  Put,
  HttpStatus,
} from '@nestjs/common'
import { ZodValidationPipe } from '@common/pipes/validation.pipe'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { User } from '@modules/user/entities/user.entity'
import {
  UpdateRoleDtoSwagger,
  CreateRoleDtoSwagger,
  QueryRoleSchema,  
  UpdateRoleSchema,
  CreateRoleSchema,
  UpdateRoleDto,
  CreateRoleDto,
} from './dto/index'
import { RoleService } from './role.service'
import { Role } from './entities/role.entity'
import { AuthGuard } from '@common/guards/auth.guard'

@ApiTags('角色')
@Controller('role')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: '查询角色' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量', example: 10 })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取用户列表', type: Role, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @Get('query')
  @UsePipes(new ZodValidationPipe(QueryRoleSchema))
  async findAll(    
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() currentUser: User) {
    return await this.roleService.findAll(page, limit, currentUser)
  }

  @ApiOperation({ summary: '创建角色' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateRoleDtoSwagger })
  @ApiResponse({ status: HttpStatus.CREATED, description: '角色创建成功', type: Role })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Post()
  @UsePipes(new ZodValidationPipe(CreateRoleSchema))
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto)
  }

  @ApiOperation({ summary: '获取指定角色信息' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '角色ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取角色信息', type: Role })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.roleService.findById(id)
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '角色ID', type: Number })
  @ApiBody({ type: UpdateRoleDtoSwagger })
  @ApiResponse({ status: HttpStatus.OK, description: '用户更新成功', type: User })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateRoleSchema))
  async update( @Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto ) {
    return await this.roleService.update(id, updateRoleDto)
  }

  @ApiOperation({ summary: '删除角色' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '角色ID', type: Number })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: '角色删除成功' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '角色不存在' })
  @Post('delete')
  async delete(@Param('id') id: number ) {
    return this.roleService.delete(id)
  }
}

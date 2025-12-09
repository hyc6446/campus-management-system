import {
  Controller,
  Post,
  Body,
  UsePipes,
  Param,
  ValidationPipe,
  HttpStatus,
  Get,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'
import { ZodValidationPipe } from '@common/pipes/validation.pipe'
import { AuthGuard } from '@common/guards/auth.guard'
import { RoleName } from '@modules/auth/dto/index';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@app/common/guards/roles.guard'
import { CreatePermissionDto, CreatePermissionDtoSwagger, CreatePermissionSchema, QueryPermissionSchema, UpdatePermissionDto, UpdatePermissionDtoSwagger, UpdatePermissionSchema } from './dto/index'
import { PermissionService } from './permission.service'
import { Permission } from './entities/permission.entity'

@ApiTags('权限')
@Controller('permission')
@UseGuards(AuthGuard, RolesGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @ApiOperation({ summary: '查询权限' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量', example: 10 })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取权限列表', type: Permission, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @Roles(RoleName.ADMIN)
  @Get('query')
  @UsePipes(new ZodValidationPipe(QueryPermissionSchema))
  async findAll(      
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10) {
    return await this.permissionService.findAll(page, limit)
  }

  @ApiOperation({ summary: '创建权限' })
  @ApiBearerAuth()
  @ApiBody({ type: CreatePermissionDtoSwagger })
  @ApiResponse({ status: HttpStatus.CREATED, description: '权限创建成功', type: Permission })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Post()
  @UsePipes(new ZodValidationPipe(CreatePermissionSchema))
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto)
  }

  @ApiOperation({ summary: '获取指定权限信息' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '权限ID', type: Number })  
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取权限信息', type: Permission })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '权限不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.permissionService.findById(id)
  }

  @ApiOperation({ summary: '更新权限' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '权限ID', type: Number })
  @ApiBody({ type: UpdatePermissionDtoSwagger })
  @ApiResponse({ status: HttpStatus.OK, description: '权限更新成功', type: Permission })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '权限不存在' })
  @Roles(RoleName.ADMIN)
  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdatePermissionSchema))
  async update( @Param('id') id: number, @Body() updatePermissionDto: UpdatePermissionDto ) {
    return await this.permissionService.update(id, updatePermissionDto)
  }

  @ApiOperation({ summary: '删除权限' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '权限ID', type: Number })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: '权限删除成功' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '权限不存在' })
  @Roles(RoleName.ADMIN)
  @Post('delete')
  async delete(@Param('id') id: number ) {
    return await this.permissionService.delete(id)
  }
}

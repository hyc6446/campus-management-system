import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { Role } from '@app/modules/role/role.entity'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { RoleService } from './role.service'
import { UpdateDto, CreateDto, QueryDto, ListResDto, ResponseDto } from './dto/index'
import { ApiOk, ApiCreated, ApiResponses } from '@app/common/decorators/api-responses.decorator'
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
  @ApiOk(ListResDto)
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Read })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.roleService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定角色信息' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Read })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.roleService.findByIdWithFull(id)
  }

  @ApiOperation({ summary: '创建角色' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Create })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.roleService.create(createData)
  }

  @ApiOperation({ summary: '更新角色' })
  @ApiOk(ResponseDto, '更新成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: UpdateDto) {
    return await this.roleService.update(id, updateData)
  }

  @ApiOperation({ summary: '停用角色' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Delete })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.delete(id)
  }

  @ApiOperation({ summary: '恢复角色' })
  @ApiOk(ResponseDto, '恢复成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Role, action: Action.Restore })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.restore(id)
  }
}

import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { ApiOk, ApiCreated, ApiResponses } from '@app/common/decorators/api-responses.decorator'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { PermissionService } from '@app/modules/permission/permission.service'
import {
  CreateDto,
  QueryDto,
  UpdateDto,
  PermissionsResDto,
  ResponseDto,
} from '@app/modules/permission/dto'
import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
  Query,
  Put,
  UseInterceptors,
  Delete,
} from '@nestjs/common'

@ApiTags('权限')
@Controller('permission')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @ApiOperation({ summary: '查询权限列表' })
  @ApiOk(PermissionsResDto)
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Permission })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.permissionService.findAll(query)
  }

  @ApiOperation({ summary: '获取权限信息' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Permission })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.findById(id)
  }

  @ApiOperation({ summary: '创建权限' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Permission })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.permissionService.create(createData)
  }
  @ApiOperation({ summary: '更新权限' })
  @ApiOk(ResponseDto, '更新成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Permission })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.permissionService.update(id, updatedata)
  }

  @ApiOperation({ summary: '停用权限' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Permission })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.delete(id)
  }

  @ApiOperation({ summary: '恢复权限' })
  @ApiOk(ResponseDto, '恢复成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Permission })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.restore(id)
  }
}

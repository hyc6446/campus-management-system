import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { RoleType } from '@app/modules/role/role.entity'
import { Class } from '@app/modules/class/class.entity'
import { ClassService } from '@app/modules/class/class.service'
import { CreateDto, QueryDto, UpdateDto } from '@app/modules/class/dto'
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
  Delete,
} from '@nestjs/common'

@ApiTags('班级')
@Controller('class')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class ClassController {
  constructor(private classService: ClassService) {}

  @ApiOperation({ summary: '查询班级' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取班级列表',
    type: Class,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
//   @Roles(RoleType.ADMIN, RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Class })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.classService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定班级信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取班级信息', type: Class })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该班级不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
//   @Roles(RoleType.ADMIN, RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Class })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.classService.findById(id)
  }

  @ApiOperation({ summary: '创建班级' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '班级创建成功', type: Class })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Class })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.classService.create(createData)
  }
  @ApiOperation({ summary: '更新班级' })
  @ApiResponse({ status: HttpStatus.OK, description: '班级更新成功', type: Class })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该班级不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Class })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.classService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除班级' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该班级不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '班级删除成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Class })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.classService.delete(id)
  }

  @ApiOperation({ summary: '恢复班级' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该班级不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '班级恢复成功' })      
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Class })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.classService.restore(id)
  }
}

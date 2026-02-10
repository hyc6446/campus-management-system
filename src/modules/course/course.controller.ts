import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { RoleType } from '@app/modules/role/role.entity'
import { Course } from '@app/modules/course/course.entity'
import { CourseService } from '@app/modules/course/course.service'
import { CreateDto, QueryDto, UpdateDto } from '@app/modules/course/dto'
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

@ApiTags('课程')
@Controller('course')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class CourseController {
  constructor(private courseService: CourseService) {}

  @ApiOperation({ summary: '查询课程' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取课程列表',
    type: Course,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Course })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.courseService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定课程信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取课程信息', type: Course })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该课程不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Course })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.findById(id)
  }

  @ApiOperation({ summary: '创建课程' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '课程创建成功', type: Course })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Course })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.courseService.create(createData)
  }

  @ApiOperation({ summary: '更新课程' })
  @ApiResponse({ status: HttpStatus.OK, description: '课程更新成功', type: Course })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该课程不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Course })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.courseService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除课程' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该课程不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '课程删除成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Course })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.delete(id)
  }

  @ApiOperation({ summary: '恢复课程' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该课程不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '课程恢复成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Course })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.restore(id)
  }
}

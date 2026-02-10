import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { RoleType } from '@app/modules/role/role.entity'
import { CourseEnrollment } from '@app/modules/course-enrollment/course-enrollment.entity'
import { CourseEnrollmentService } from '@app/modules/course-enrollment/course-enrollment.service'
import { CreateDto, QueryDto, UpdateDto } from '@app/modules/course-enrollment/dto'
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

@ApiTags('课程订阅')
@Controller('course-enrollment')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class CourseEnrollmentController {
  constructor(private courseEnrollmentService: CourseEnrollmentService) {}

  @ApiOperation({ summary: '查询课程订阅' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取课程订阅列表',
    type: CourseEnrollment,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  // @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.CourseEnrollment })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.courseEnrollmentService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定课程订阅信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取课程订阅信息', type: CourseEnrollment })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该课程订阅不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  // @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.CourseEnrollment })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.courseEnrollmentService.findById(id)
  }

  @ApiOperation({ summary: '创建课程订阅' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '课程订阅创建成功', type: CourseEnrollment })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.STUDENT)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.CourseEnrollment })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.courseEnrollmentService.create(createData)
  }
  @ApiOperation({ summary: '更新课程订阅' })
  @ApiResponse({ status: HttpStatus.OK, description: '课程订阅更新成功', type: CourseEnrollment })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该课程订阅不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.CourseEnrollment })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.courseEnrollmentService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除课程订阅' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该课程订阅不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '课程订阅删除成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.CourseEnrollment })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.courseEnrollmentService.delete(id)
  }

  @ApiOperation({ summary: '恢复课程订阅' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该课程订阅不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '课程订阅恢复成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.CourseEnrollment })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.courseEnrollmentService.restore(id)
  }


}

import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { RoleType } from '@app/modules/role/role.entity'
import { Student } from '@app/modules/student/student.entity'
import { StudentService } from '@app/modules/student/student.service'
import { CreateDto, QueryDto, UpdateDto } from '@app/modules/student/dto'
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

@ApiTags('学生')
@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @ApiOperation({ summary: '查询学生' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取学生列表',
    type: Student,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Student })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.studentService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定学生信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取学生信息', type: Student })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该学生不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Student })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.findById(id)
  }

  @ApiOperation({ summary: '创建学生' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '学生创建成功', type: Student })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Student })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.studentService.create(createData)
  }
  @ApiOperation({ summary: '更新学生' })
  @ApiResponse({ status: HttpStatus.OK, description: '学生更新成功', type: Student })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该学生不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Student })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.studentService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除学生' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该学生不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '学生删除成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Student })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.delete(id)
  }

  @ApiOperation({ summary: '恢复学生' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该学生不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '学生恢复成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Student })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.restore(id)
  }
}

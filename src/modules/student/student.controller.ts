import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { StudentService } from '@app/modules/student/student.service'
import { CreateDto, QueryDto, UpdateDto, ListResDto, ResponseDto } from '@app/modules/student/dto'
import { ApiOk, ApiCreated, ApiResponses } from '@app/common/decorators/api-responses.decorator'
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

@ApiTags('学生')
@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class StudentController {
  constructor(private studentService: StudentService) {}

  @ApiOperation({ summary: '查询学生' })
  @ApiOk(ListResDto)
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Student })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.studentService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定学生信息' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Student })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.findById(id)
  }

  @ApiOperation({ summary: '创建学生' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Student })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.studentService.create(createData)
  }
  @ApiOperation({ summary: '更新学生' })
  @ApiOk(ResponseDto, '更新成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Student })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.studentService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除学生' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Student })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.delete(id)
  }

  @ApiOperation({ summary: '恢复学生' })
  @ApiOk(ResponseDto, '恢复成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Student })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.studentService.restore(id)
  }
}

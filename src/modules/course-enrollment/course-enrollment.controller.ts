import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { CourseEnrollmentService } from '@app/modules/course-enrollment/course-enrollment.service'
import {
  CreateDto,
  QueryDto,
  UpdateDto,
  ListResDto,
  ResponseDto,
} from '@app/modules/course-enrollment/dto'
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

@ApiTags('课程订阅')
@Controller('course-enrollment')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class CourseEnrollmentController {
  constructor(private courseEnrollmentService: CourseEnrollmentService) {}

  @ApiOperation({ summary: '查询课程订阅' })
  @ApiOk(ListResDto)
  // @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.CourseEnrollment })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.courseEnrollmentService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定课程订阅信息' })
  @ApiOk(ResponseDto)
  // @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.CourseEnrollment })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.courseEnrollmentService.findById(id)
  }

  @ApiOperation({ summary: '创建课程订阅' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ conflict: true })
  @Roles(RoleType.STUDENT)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.CourseEnrollment })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.courseEnrollmentService.create(createData)
  }
  @ApiOperation({ summary: '更新课程订阅' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.CourseEnrollment })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.courseEnrollmentService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除课程订阅' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.CourseEnrollment })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.courseEnrollmentService.delete(id)
  }

  @ApiOperation({ summary: '恢复课程订阅' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.CourseEnrollment })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.courseEnrollmentService.restore(id)
  }
}

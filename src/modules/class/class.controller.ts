import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { ClassService } from '@app/modules/class/class.service'
import { CreateDto, QueryDto, UpdateDto, ListResDto, ResponseDto } from '@app/modules/class/dto'
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

@ApiTags('班级')
@Controller('class')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class ClassController {
  constructor(private classService: ClassService) {}

  @ApiOperation({ summary: '查询班级' })
  @ApiOk(ListResDto)
  //   @Roles(RoleType.ADMIN, RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Class })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.classService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定班级信息' })
  @ApiOk(ResponseDto)
  //   @Roles(RoleType.ADMIN, RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Class })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.classService.findById(id)
  }

  @ApiOperation({ summary: '创建班级' })
  @ApiCreated(ResponseDto)
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Class })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.classService.create(createData)
  }
  @ApiOperation({ summary: '更新班级' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Class })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.classService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除班级' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Class })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.classService.delete(id)
  }

  @ApiOperation({ summary: '恢复班级' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Class })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.classService.restore(id)
  }
}

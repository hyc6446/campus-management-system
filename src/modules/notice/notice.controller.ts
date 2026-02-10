import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { ApiOk, ApiCreated, ApiResponses } from '@app/common/decorators/api-responses.decorator'
import { RoleType } from '@app/modules/role/role.entity'
import { SystemNotice } from '@app/modules/notice/notice.entity'
import { NoticeService } from '@app/modules/notice/notice.service'
import { ErrResDto } from '@app/common/validators/zod-validators'
import { CreateDto, QueryDto, UpdateDto, NoticesResDto, ResponseDto } from '@app/modules/notice/dto'
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

@ApiTags('公告')
@Controller('notice')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  @ApiOperation({ summary: '查询公告' })
  @ApiOk(NoticesResDto)
  // @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Notice })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.noticeService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定公告信息' })
  @ApiOk(ResponseDto)
  // @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Notice })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.noticeService.findById(id)
  }

  @ApiOperation({ summary: '创建公告' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Notice })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.noticeService.create(createData)
  }
  @ApiOperation({ summary: '更新公告' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Notice })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.noticeService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除公告' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Notice })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.noticeService.delete(id)
  }

  @ApiOperation({ summary: '恢复公告' })
  @ApiOk(ResponseDto, '恢复成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Notice })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.noticeService.restore(id)
  }
}

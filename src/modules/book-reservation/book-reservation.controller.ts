import { ZodSerializerInterceptor } from 'nestjs-zod'
import * as pt from '@app/common/prisma-types'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { RoleType } from '@app/modules/role/role.entity'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { BookReservation } from '@app/modules/book-reservation/book-reservation.entity'
import { BookReservationService } from '@app/modules/book-reservation/book-reservation.service'
import {
  CreateDto,
  QueryDto,
  UpdateDto,
  ListResDto,
  ResponseDto,
} from '@app/modules/book-reservation/dto'
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

@ApiTags('图书预约')
@Controller('book-reservation')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class BookReservationController {
  constructor(private bookReservationService: BookReservationService) {}

  @ApiOperation({ summary: '查询图书预约' })
  @ApiOk(ListResDto)
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.BookReservation })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.bookReservationService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定图书预约信息' })
  @ApiOk(ResponseDto)
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.BookReservation })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<pt.SAFE_BOOK_RESERVATION_TYPE> {
    return await this.bookReservationService.findById(id)
  }

  @ApiOperation({ summary: '创建图书预约' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ conflict: true })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.BookReservation })
  @Post()
  async create(@CurrentUser() user: pt.SAFE_USER_TYPE, @Body() data: CreateDto) {
    return await this.bookReservationService.create(data, user.id)
  }

  @ApiOperation({ summary: '更新图书预约' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.BookReservation })
  @Put(':id')
  async update(
    @CurrentUser() user: pt.SAFE_USER_TYPE,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedata: UpdateDto
  ) {
    return await this.bookReservationService.update(user.id, id, updatedata)
  }

  @ApiOperation({ summary: '停用图书预约' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.BookReservation })
  @Delete(':id')
  async delete(@CurrentUser() user: pt.SAFE_USER_TYPE, @Param('id', ParseIntPipe) id: number) {
    return await this.bookReservationService.delete(user.id, id)
  }

  @ApiOperation({ summary: '恢复图书预约' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.BookReservation })
  @Put(':id/restore')
  async restore(@CurrentUser() user: pt.SAFE_USER_TYPE, @Param('id', ParseIntPipe) id: number) {
    return await this.bookReservationService.restore(user.id, id)
  }
}

import { RoleType } from '@prisma/client'
import * as pt from '@app/common/prisma-types'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { CurrentUser } from '@app/common/decorators/current-user.decorator'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { BorrowService } from '@app/modules/borrow/borrow.service'
import { CreateDto, QueryDto, UpdateDto, ListResDto, ResponseDto } from '@app/modules/borrow/dto'
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

@ApiTags('图书借阅')
@Controller('borrow')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class BorrowController {
  constructor(private borrowService: BorrowService) {}

  @ApiOperation({ summary: '查询图书借阅' })
  @ApiOk(ListResDto)
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Borrow })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.borrowService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定图书借阅信息' })
  @ApiOk(ResponseDto)
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Borrow })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<pt.SAFE_BORROW_TYPE> {
    return await this.borrowService.findById(id)
  }

  @ApiOperation({ summary: '创建图书借阅' })
  @ApiCreated(ResponseDto)
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Borrow })
  @Post()
  async create(@CurrentUser() user: pt.SAFE_USER_TYPE, @Body() data: CreateDto) {
    return await this.borrowService.create(data, user.id)
  }
  @ApiOperation({ summary: '更新图书借阅' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Borrow })
  @Put(':id')
  async update(
    @CurrentUser() user: pt.SAFE_USER_TYPE,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedata: UpdateDto
  ) {
    return await this.borrowService.update(user, id, updatedata)
  }

  @ApiOperation({ summary: '删除图书借阅' })
  @ApiOk(null)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Borrow })
  @Delete(':id')
  async delete(@CurrentUser() user: pt.SAFE_USER_TYPE, @Param('id', ParseIntPipe) id: number) {
    return await this.borrowService.delete(user, id)
  }

  @ApiOperation({ summary: '恢复图书借阅' })
  @ApiOk(null)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Borrow })
  @Put(':id/restore')
  async restore(@CurrentUser() user: pt.SAFE_USER_TYPE, @Param('id', ParseIntPipe) id: number) {
    return await this.borrowService.restore(user, id)
  }
}

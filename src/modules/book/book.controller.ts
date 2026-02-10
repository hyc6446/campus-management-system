import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { BookService } from '@app/modules/book/book.service'
import { CreateDto, QueryDto, UpdateDto, ListResDto, ResponseDto } from '@app/modules/book/dto'
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

@ApiTags('图书')
@Controller('book')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class BookController {
  constructor(private bookService: BookService) {}

  @ApiOperation({ summary: '查询图书' })
  @ApiOk(ListResDto)
  @Roles(RoleType.ADMIN, RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Book })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.bookService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定图书信息' })
  @ApiOk(ResponseDto)
  @Roles(RoleType.ADMIN, RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Book })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.findById(id)
  }

  @ApiOperation({ summary: '创建图书' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Book })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.bookService.create(createData)
  }

  @ApiOperation({ summary: '更新图书' })
  @ApiOk(ResponseDto)
  @ApiResponses({ conflict: true, notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.Book })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.bookService.update(id, updatedata)
  }

  @ApiOperation({ summary: '停用图书' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Book })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.delete(id)
  }

  @ApiOperation({ summary: '恢复图书' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Book })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.restore(id)
  }
}

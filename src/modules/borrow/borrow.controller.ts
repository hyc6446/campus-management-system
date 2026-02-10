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
import { Borrow } from '@app/modules/borrow/borrow.entity'
import { BorrowService } from '@app/modules/borrow/borrow.service'
import { CreateDto, QueryDto, UpdateDto } from '@app/modules/borrow/dto'
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

@ApiTags('图书借阅')
@Controller('borrow')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class BorrowController {
  constructor(private borrowService: BorrowService) {}

  @ApiOperation({ summary: '查询图书借阅' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取图书借阅列表',
    type: Borrow,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Borrow })
  @Get()
  async findAll(
    @Query() query: QueryDto
  ): Promise<pt.QUERY_LIST_TYPE<pt.SAFE_BORROW_TYPE>> {
    return await this.borrowService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定图书借阅信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取图书借阅信息', type: Borrow })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该图书借阅不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.Borrow })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<pt.SAFE_BORROW_TYPE> {
    return await this.borrowService.findById(id)
  }

  @ApiOperation({ summary: '创建图书借阅' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '图书借阅创建成功',
    type: Borrow,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.Borrow })
  @Post()
  async create(@CurrentUser() user: pt.SAFE_USER_TYPE, @Body() data: CreateDto) {
    return await this.borrowService.create(data, user.id)
  }
  @ApiOperation({ summary: '更新图书借阅' })
  @ApiResponse({ status: HttpStatus.OK, description: '图书借阅更新成功', type: Borrow })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该图书借阅不存在' })
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
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该图书借阅不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '图书借阅删除成功' })  
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.Borrow })
  @Delete(':id')
  async delete(@CurrentUser() user: pt.SAFE_USER_TYPE, @Param('id', ParseIntPipe) id: number) {
    return await this.borrowService.delete(user, id)
  }

  @ApiOperation({ summary: '恢复图书借阅' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该图书借阅不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '图书借阅恢复成功' })
  @Roles(RoleType.TEACHER, RoleType.STUDENT)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.Borrow })
  @Put(':id/restore')
  async restore(@CurrentUser() user: pt.SAFE_USER_TYPE, @Param('id', ParseIntPipe) id: number) {
    return await this.borrowService.restore(user, id)
  }
}

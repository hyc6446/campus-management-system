import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { RoleType } from '@app/modules/role/role.entity'
import { LibrarySeat } from '@app/modules/library-seat/library-seat.entity'
import { LibrarySeatService } from '@app/modules/library-seat/library-seat.service'
import { CreateDto, QueryDto, UpdateDto } from '@app/modules/library-seat/dto'
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

@ApiTags('图书馆座位')
@Controller('library-seat')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class LibrarySeatController {
  constructor(private librarySeatService: LibrarySeatService) {}  

  @ApiOperation({ summary: '查询图书馆座位' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取图书馆座位列表',
    type: LibrarySeat,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.LibrarySeat })
  @Get()
  async findAll(@Query() query: QueryDto) {   
    return await this.librarySeatService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定图书馆座位信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取图书馆座位信息', type: LibrarySeat })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该图书馆座位不存在' }) 
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.LibrarySeat })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.librarySeatService.findById(id)
  }

  @ApiOperation({ summary: '创建图书馆座位' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '图书馆座位创建成功', type: LibrarySeat })  
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.LibrarySeat })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.librarySeatService.create(createData)
  }
  @ApiOperation({ summary: '更新图书馆座位' })
  @ApiResponse({ status: HttpStatus.OK, description: '图书馆座位更新成功', type: LibrarySeat })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该图书馆座位不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.LibrarySeat })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.librarySeatService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除图书馆座位' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该图书馆座位不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '图书馆座位删除成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.LibrarySeat })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.librarySeatService.delete(id)
  }

  @ApiOperation({ summary: '恢复图书馆座位' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该图书馆座位不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '图书馆座位恢复成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.LibrarySeat })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.librarySeatService.restore(id)
  }
}

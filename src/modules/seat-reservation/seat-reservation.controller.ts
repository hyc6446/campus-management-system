import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { RoleType } from '@app/modules/role/role.entity'
import { SeatReservation } from '@app/modules/seat-reservation/seat-reservation.entity'
import { SeatReservationService } from '@app/modules/seat-reservation/seat-reservation.service'
import { CreateDto, QueryDto, UpdateDto } from '@app/modules/seat-reservation/dto'
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

@ApiTags('座位预约')
@Controller('seat-reservation')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class SeatReservationController {
  constructor(private seatReservationService: SeatReservationService) {}

  @ApiOperation({ summary: '查询座位预约' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取座位预约列表',
    type: SeatReservation,
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.SeatReservation })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.seatReservationService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定座位预约信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取座位预约信息', type: SeatReservation })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该座位预约不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.SeatReservation })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.seatReservationService.findById(id)
  }

  @ApiOperation({ summary: '创建座位预约' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '座位预约创建成功',
    type: SeatReservation,
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.SeatReservation })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.seatReservationService.create(createData)
  }
  @ApiOperation({ summary: '更新座位预约' })
  @ApiResponse({ status: HttpStatus.OK, description: '座位预约更新成功', type: SeatReservation })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该座位预约不存在' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.SeatReservation })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedata: UpdateDto
  ) {
    return await this.seatReservationService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除座位预约' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该座位预约不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '座位预约删除成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.SeatReservation })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.seatReservationService.delete(id)
  }

  @ApiOperation({ summary: '恢复座位预约' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无操作权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '该座位预约不存在' })
  @ApiResponse({ status: HttpStatus.OK, description: '座位预约恢复成功' })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.SeatReservation })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.seatReservationService.restore(id)
  }
}

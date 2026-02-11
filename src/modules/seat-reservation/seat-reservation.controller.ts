import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { SeatReservationService } from '@app/modules/seat-reservation/seat-reservation.service'
import {
  CreateDto,
  QueryDto,
  UpdateDto,
  ListResDto,
  ResponseDto,
} from '@app/modules/seat-reservation/dto'
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

@ApiTags('座位预约')
@Controller('seat-reservation')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class SeatReservationController {
  constructor(private seatReservationService: SeatReservationService) {}

  @ApiOperation({ summary: '查询座位预约' })
  @ApiOk(ListResDto)
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.SeatReservation })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.seatReservationService.findAll(query)
  }

  @ApiOperation({ summary: '获取指定座位预约信息' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Permissions({ action: Action.Read, subject: SubjectsEnum.SeatReservation })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.seatReservationService.findById(id)
  }

  @ApiOperation({ summary: '创建座位预约' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Create, subject: SubjectsEnum.SeatReservation })
  @Post()
  async create(@Body() createData: CreateDto) {
    return await this.seatReservationService.create(createData)
  }
  @ApiOperation({ summary: '更新座位预约' })
  @ApiOk(ResponseDto, '更新成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Update, subject: SubjectsEnum.SeatReservation })
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatedata: UpdateDto) {
    return await this.seatReservationService.update(id, updatedata)
  }

  @ApiOperation({ summary: '删除座位预约' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Delete, subject: SubjectsEnum.SeatReservation })
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.seatReservationService.delete(id)
  }

  @ApiOperation({ summary: '恢复座位预约' })
  @ApiOk(ResponseDto, '恢复成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ action: Action.Restore, subject: SubjectsEnum.SeatReservation })
  @Put(':id/restore')
  async restore(@Param('id', ParseIntPipe) id: number) {
    return await this.seatReservationService.restore(id)
  }
}

import { Injectable } from '@nestjs/common'
import { Prisma, ReservationStatus } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/seat-reservation/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class SeatReservationRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取座位预约列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 座位预约列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.SeatReservationWhereInput,
    orderBy: Prisma.SeatReservationOrderByWithRelationInput
  ): Promise<{ data: pt.SAFE_SEAT_RESERVATION_TYPE[]; total: number; page: number; take: number }> {
    const [data, total] = await Promise.all([
      this.prisma.seatReservation.findMany({
        where,
        skip,
        take,
        orderBy,
        select: pt.SAFE_SEAT_RESERVATION_FIELDS,
      }),
      this.prisma.seatReservation.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取座位预约（可选）
   * @param id 座位预约ID
   * @returns 座位预约详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_SEAT_RESERVATION_TYPE | null> {
    return this.prisma.seatReservation.findUnique({
      where: { id, deletedAt: null },
      select: pt.DEFAULT_SEAT_RESERVATION_FIELDS,
    })
  }
  async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_SEAT_RESERVATION_TYPE | null> {
    return this.prisma.seatReservation.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_SEAT_RESERVATION_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_SEAT_RESERVATION_TYPE | null> {
    return this.prisma.seatReservation.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_SEAT_RESERVATION_FIELDS,
    })
  }
  /**
   * 根据名称获取座位预约（可选）
   * @param name 座位预约名称
   * @returns 座位预约详情或null
   */
  async findByUserOptional(userId: number): Promise<pt.DEFAULT_SEAT_RESERVATION_TYPE | null> {
    return this.prisma.seatReservation.findFirst({
      where: { userId, status: ReservationStatus.CONFIRMED, deletedAt: null },
      select: pt.DEFAULT_SEAT_RESERVATION_FIELDS,
    })
  }
  async findByUserOptionalWithSafe(userId: number): Promise<pt.SAFE_SEAT_RESERVATION_TYPE | null> {
    return this.prisma.seatReservation.findFirst({
      where: { userId, status: ReservationStatus.CONFIRMED, deletedAt: null },
      select: pt.SAFE_SEAT_RESERVATION_FIELDS,
    })
  }
  async findByUserOptionalWithFull(userId: number): Promise<pt.FULL_SEAT_RESERVATION_TYPE | null> {
    return this.prisma.seatReservation.findFirst({
      where: { userId, status: ReservationStatus.CONFIRMED, deletedAt: null },
      select: pt.FULL_SEAT_RESERVATION_FIELDS,
    })
  }
  /**
   * 创建座位预约
   * @param data 座位预约数据
   * @returns 创建的座位预约
   */
  async create(data: CreateDto): Promise<pt.SAFE_SEAT_RESERVATION_TYPE> {
    return this.prisma.seatReservation.create({
      data,
      select: pt.SAFE_SEAT_RESERVATION_FIELDS,
    })
  }

  /**
   * 更新座位预约
   * @param id 座位预约ID
   * @param data 更新数据
   * @returns 更新后的座位预约
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_SEAT_RESERVATION_TYPE> {
    return this.prisma.seatReservation.update({
      where: { id },
      data,
      select: pt.SAFE_SEAT_RESERVATION_FIELDS,
    })
  }

  /**
   * 删除座位预约（软删除）
   * @param id 座位预约ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const deletedSeatReservation = await this.prisma.seatReservation.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: pt.SAFE_SEAT_RESERVATION_FIELDS,
    })
    return deletedSeatReservation !== null
  }

  /**
   * 恢复已删除座位预约
   * @param id 座位预约ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const restoredSeatReservation = await this.prisma.seatReservation.update({
      where: { id },
      data: { deletedAt: null },
    })
    return restoredSeatReservation !== null
  }
}

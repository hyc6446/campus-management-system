import { Injectable, HttpStatus } from '@nestjs/common'
import { SeatReservationRepository } from '@app/modules/seat-reservation/seat-reservation.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/seat-reservation/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma, ReservationStatus } from '@prisma/client'

@Injectable()
export class SeatReservationService {
  constructor(private seatReservationRepository: SeatReservationRepository) {}

  /**
   * 获取座位预约列表（分页）
   * @param query 查询参数
   * @returns 座位预约列表和总数
   */
  async findAll(
    query: QueryDto
  ): Promise<{ data: pt.SAFE_SEAT_RESERVATION_TYPE[]; total: number; page: number; take: number }> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      seatId,
      userId,
      status,
      createdAt,
    } = query
    const skip = (page - 1) * take
    const where: Prisma.SeatReservationWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (seatId) where.seatId = seatId
    if (userId) where.userId = userId
    if (status) where.status = status
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.SeatReservationOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.seatReservationRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取座位预约
   * @param id 座位预约ID
   * @returns 座位预约详情
   */
  async findById(id: number): Promise<pt.DEFAULT_SEAT_RESERVATION_TYPE> {
    const data = await this.seatReservationRepository.findByIdOptional(id)
    if (!data)
      throw new AppException('座位预约不存在', 'SeatReservation_No_Found', HttpStatus.NOT_FOUND)
    return data
  }

  /**
   * 根据ID获取座位预约（可选）
   * @param id 座位预约ID
   * @returns 座位预约详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_SEAT_RESERVATION_TYPE | null> {
    return await this.seatReservationRepository.findByIdOptional(id)
  }

  /**
   * 创建座位预约
   * @param data 座位预约数据
   * @returns 创建的座位预约
   */
  async create(data: CreateDto): Promise<pt.SAFE_SEAT_RESERVATION_TYPE> {
    const existingSeatReservation = await this.seatReservationRepository.findByUserOptional(
      data.userId
    )
    if (existingSeatReservation)
      throw new AppException('用户已存在座位预约', 'SeatReservation_Exist', HttpStatus.BAD_REQUEST)
    return this.seatReservationRepository.create(data)
  }

  /**
   * 更新座位预约
   * @param id 座位预约ID
   * @param data 更新数据
   * @returns 更新后的座位预约
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_SEAT_RESERVATION_TYPE> {
    // 检查座位预约是否存在
    const updatedata = await this.seatReservationRepository.findByIdOptionalWithFull(id)
    if (!updatedata)
      throw new AppException('座位预约不存在', 'SeatReservation_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否已存在座位预约
    if (
      updatedata.status === ReservationStatus.CONFIRMED ||
      updatedata.status === ReservationStatus.EXPIRED
    )
      throw new AppException(
        '预约流程已完成，无法更新',
        'SeatReservation_Completed',
        HttpStatus.BAD_REQUEST
      )
    // 检查座位预约是否已删除
    if (updatedata.deletedAt)
      throw new AppException('该数据已废弃', 'SeatReservation_Deleted', HttpStatus.BAD_REQUEST)
    return this.seatReservationRepository.update(id, data)
  }

  /**
   * 删除座位预约（软删除）
   * @param id 座位预约ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    // 检查座位预约是否存在
    const seatReservationdata = await this.seatReservationRepository.findByIdOptionalWithFull(id)
    if (!seatReservationdata)
      throw new AppException('座位预约不存在', 'SeatReservation_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否已存在座位预约
    if (
      seatReservationdata.status !== ReservationStatus.CONFIRMED &&
      seatReservationdata.status !== ReservationStatus.EXPIRED
    )
      throw new AppException(
        '预约流程未完成，无法删除',
        'SeatReservation_Not_Completed',
        HttpStatus.BAD_REQUEST
      )
    // 检查座位预约是否已删除
    if (seatReservationdata.deletedAt)
      throw new AppException('该数据已废弃', 'SeatReservation_Deleted', HttpStatus.BAD_REQUEST)
    return this.seatReservationRepository.delete(id)
  }

  /**
   * 恢复已删除座位预约
   * @param id 座位预约ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    // 检查座位预约是否存在
    const seatReservationdata = await this.seatReservationRepository.findByIdOptionalWithFull(id)
    if (!seatReservationdata)
      throw new AppException('座位预约不存在', 'SeatReservation_No_Found', HttpStatus.NOT_FOUND)
    // 检查座位预约是否已删除
    if (!seatReservationdata.deletedAt)
      throw new AppException('该数据未废弃', 'SeatReservation_Not_Deleted', HttpStatus.BAD_REQUEST)
    return this.seatReservationRepository.restore(id)
  }
}

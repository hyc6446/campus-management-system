import { Injectable, HttpStatus } from '@nestjs/common'
import { LibrarySeatRepository } from '@app/modules/library-seat/library-seat.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/library-seat/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class LibrarySeatService {
  constructor(private librarySeatRepository: LibrarySeatRepository) {}

  /**
   * 获取图书馆座位列表（分页）
   * @param query 查询参数
   * @returns 图书馆座位列表和总数
   */
  async findAll(
    query: QueryDto
  ): Promise<pt.QUERY_LIST_TYPE<pt.SAFE_LIBRARY_SEAT_TYPE>> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      seatNumber,
      status,
      createdAt,
    } = query
    const skip = (page - 1) * take
    const where: Prisma.LibrarySeatWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (seatNumber) where.seatNumber = { contains: seatNumber }
    if (status) where.status = status
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.LibrarySeatOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.librarySeatRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取图书馆座位
   * @param id 图书馆座位ID
   * @returns 图书馆座位详情
   */
  async findById(id: number): Promise<pt.DEFAULT_LIBRARY_SEAT_TYPE> { 
    const data = await this.librarySeatRepository.findByIdOptional(id)
    if (!data) throw new AppException('图书馆座位不存在', 'LibrarySeat_No_Found', HttpStatus.NOT_FOUND)
    return data
  }

  /**
   * 根据ID获取图书馆座位（可选）
   * @param id 图书馆座位ID
   * @returns 图书馆座位详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_LIBRARY_SEAT_TYPE | null> {
    return await this.librarySeatRepository.findByIdOptional(id)
  }

  /**
   * 创建新图书馆座位
   * @param data 图书馆座位数据
   * @returns 创建的图书馆座位
   */
  async create(data: CreateDto): Promise<pt.SAFE_LIBRARY_SEAT_TYPE> {
    const existingLibrarySeat = await this.librarySeatRepository.findByNumberOptional(data.seatNumber)
    if (existingLibrarySeat) throw new AppException('图书馆座位已存在', 'LibrarySeat_Exist', HttpStatus.BAD_REQUEST)
    return this.librarySeatRepository.create(data)
  }

  /**
   * 更新图书馆座位
   * @param id 图书馆座位ID
   * @param data 更新数据
   * @returns 更新后的图书馆座位
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_LIBRARY_SEAT_TYPE> {
    // 检查图书馆座位是否存在
    const updatedata = await this.librarySeatRepository.findByIdOptionalWithFull(id)
    if (!updatedata) throw new AppException('图书馆座位不存在', 'LibrarySeat_No_Found', HttpStatus.NOT_FOUND)
    // 检查图书馆座位是否已删除
    if (updatedata.deletedAt)
      throw new AppException('该数据已废弃', 'LibrarySeat_Deleted', HttpStatus.BAD_REQUEST)
    return this.librarySeatRepository.update(id, data)
  }

  /**
   * 删除图书馆座位（软删除）
   * @param id 图书馆座位ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    // 检查图书馆座位是否存在
    const librarySeatdata = await this.librarySeatRepository.findByIdOptionalWithFull(id)
    if (!librarySeatdata) throw new AppException('图书馆座位不存在', 'LibrarySeat_No_Found', HttpStatus.NOT_FOUND)
    // 检查图书馆座位是否已删除
    if (librarySeatdata.deletedAt)
      throw new AppException('该数据已废弃', 'LibrarySeat_Deleted', HttpStatus.BAD_REQUEST)
    return this.librarySeatRepository.delete(id)
  }

  /**
   * 恢复已删除图书馆座位
   * @param id 图书馆座位ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    // 检查图书馆座位是否存在
    const librarySeatdata = await this.librarySeatRepository.findByIdOptionalWithFull(id)
    if (!librarySeatdata) throw new AppException('图书馆座位不存在', 'LibrarySeat_No_Found', HttpStatus.NOT_FOUND)
    // 检查图书馆座位是否已删除
    if (!librarySeatdata.deletedAt)
      throw new AppException('该数据未废弃', 'LibrarySeat_Not_Deleted', HttpStatus.BAD_REQUEST)
    return this.librarySeatRepository.restore(id)
  }
}

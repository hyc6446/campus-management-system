import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/library-seat/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class LibrarySeatRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取图书馆座位列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 图书馆座位列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.LibrarySeatWhereInput,
    orderBy: Prisma.LibrarySeatOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_LIBRARY_SEAT_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.librarySeat.findMany({ where, skip, take, orderBy, select: pt.DEFAULT_LIBRARY_SEAT_FIELDS }),
      this.prisma.librarySeat.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取图书馆座位（可选）
   * @param id 图书馆座位ID
   * @returns 图书馆座位详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_LIBRARY_SEAT_TYPE | null> {
    return this.prisma.librarySeat.findUnique({
      where: { id, deletedAt: null },
      select: pt.DEFAULT_LIBRARY_SEAT_FIELDS,
    })
  }
  async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_LIBRARY_SEAT_TYPE | null> {
    return this.prisma.librarySeat.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_LIBRARY_SEAT_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_LIBRARY_SEAT_TYPE | null> {
    return this.prisma.librarySeat.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_LIBRARY_SEAT_FIELDS,
    })
  }
  /**
   * 根据名称获取图书馆座位（可选）
   * @param name 图书馆座位名称
   * @returns 图书馆座位详情或null
   */
  async findByNumberOptional(seatNumber: string): Promise<pt.DEFAULT_LIBRARY_SEAT_TYPE | null> {
    return this.prisma.librarySeat.findUnique({
      where: { seatNumber, deletedAt: null },
      select: pt.DEFAULT_LIBRARY_SEAT_FIELDS,
    })
  }
  async findByNumberOptionalWithSafe(seatNumber: string): Promise<pt.SAFE_LIBRARY_SEAT_TYPE | null> {
    return this.prisma.librarySeat.findUnique({
      where: { seatNumber, deletedAt: null },
      select: pt.SAFE_LIBRARY_SEAT_FIELDS,
    })
  }
  async findByNumberOptionalWithFull(seatNumber: string): Promise<pt.FULL_LIBRARY_SEAT_TYPE | null> {
    return this.prisma.librarySeat.findUnique({
      where: { seatNumber, deletedAt: null },
      select: pt.FULL_LIBRARY_SEAT_FIELDS,    
    })
  }
  /**
   * 创建图书馆座位
   * @param data 图书馆座位数据
   * @returns 创建的图书馆座位
   */
  async create(data: CreateDto): Promise<pt.DEFAULT_LIBRARY_SEAT_TYPE> {
    return this.prisma.librarySeat.create({
      data,
      select: pt.DEFAULT_LIBRARY_SEAT_FIELDS,
    })
  }

  /**
   * 更新图书馆座位
   * @param id 图书馆座位ID
   * @param data 更新数据
   * @returns 更新后的图书馆座位
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_LIBRARY_SEAT_TYPE> {
    return this.prisma.librarySeat.update({
      where: { id },
      data,
      select: pt.DEFAULT_LIBRARY_SEAT_FIELDS,
    })
  }

  /**
   * 删除图书馆座位（软删除）
   * @param id 图书馆座位ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const data = await this.prisma.librarySeat.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return data !== null
  }

  /**
   * 恢复已删除图书馆座位
   * @param id 图书馆座位ID 
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const data = await this.prisma.librarySeat.update({
      where: { id },
      data: { deletedAt: null },
    })
    return data !== null
  }
}

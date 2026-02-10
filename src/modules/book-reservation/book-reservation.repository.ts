import { HttpStatus, Injectable } from '@nestjs/common'
import { Prisma, ReservationStatus } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/book-reservation/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { BookRepository } from '@app/modules/book/book.repository'

@Injectable()
export class BookReservationRepository {
  constructor(
    private prisma: PrismaService,
    private bookRepository: BookRepository
  ) {}

  /**
   * 获取书籍预约列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 书籍列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.BookReservationWhereInput,
    orderBy: Prisma.BookReservationOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_BOOK_RESERVATION_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.bookReservation.findMany({
        where,
        skip,
        take,
        orderBy,
        select: pt.DEFAULT_BOOK_RESERVATION_FIELDS,
      }),
      this.prisma.bookReservation.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取书籍预约（可选）
   * @param id 书籍预约ID
   * @returns 书籍预约详情或null
   */
  async findById(id: number): Promise<pt.SAFE_BOOK_RESERVATION_TYPE | null> {
    const data = await this.prisma.bookReservation.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_BOOK_RESERVATION_FIELDS,
    })
    if (!data)
      throw new AppException('书籍预约不存在', 'Book_Reservation_Not_Found', HttpStatus.NOT_FOUND)
    return data
  }

  async findByIdOptional(id: number): Promise<pt.SAFE_BOOK_RESERVATION_TYPE | null> {
    return this.prisma.bookReservation.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_BOOK_RESERVATION_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_BOOK_RESERVATION_TYPE | null> {
    return await this.prisma.bookReservation.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_BOOK_RESERVATION_FIELDS,
    })
  }
  async findByUserIdAndBookIdOptional(
    userId: number,
    bookId: number
  ): Promise<pt.SAFE_BOOK_RESERVATION_TYPE[] | null> {
    return await this.prisma.bookReservation.findMany({
      where: {
        userId,
        bookId,
        status: { in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] },
        deletedAt: null,
      },
      select: pt.SAFE_BOOK_RESERVATION_FIELDS,
    })
  }

  /**
   * 创建新书籍预约
   * @param data 书籍预约数据
   * @returns 创建的书籍预约
   */
  async create(
    data: CreateDto,
    tx?: Prisma.TransactionClient
  ): Promise<pt.SAFE_BOOK_RESERVATION_TYPE> {
    return await (tx || this.prisma).bookReservation.create({
      data,
      select: pt.SAFE_BOOK_RESERVATION_FIELDS,
    })
  }

  /**
   * 更新书籍预约
   * @param id 书籍预约ID
   * @param data 更新数据
   * @returns 更新后的书籍预约
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_BOOK_RESERVATION_TYPE> {
    return await this.prisma.bookReservation.update({
      where: { id },
      data,
      select: pt.SAFE_BOOK_RESERVATION_FIELDS,
    })
  }

  /**
   * 删除书籍预约（软删除）
   * @param id 书籍预约ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const deletedBookReservation = await this.prisma.bookReservation.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: pt.SAFE_BOOK_RESERVATION_FIELDS,
    })
    return deletedBookReservation !== null
  }

  /**
   * 恢复已删除书籍预约
   * @param id 书籍预约ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const restoredBookReservation = await this.prisma.bookReservation.update({
      where: { id },
      data: { deletedAt: null },
      select: pt.SAFE_BOOK_RESERVATION_FIELDS,
    })
    return restoredBookReservation !== null
  }

  /**
   * 预约书籍
   * @param data 书籍预约数据
   * @returns 创建的书籍预约
   */
  async reserve(data: CreateDto): Promise<pt.SAFE_BOOK_RESERVATION_TYPE> {
    return this.prisma.$transaction(async tx => {
      const bookReservation = await this.create(data, tx)
      await this.bookRepository.reserve(bookReservation.bookId, tx)
      return bookReservation
    })
  }
}

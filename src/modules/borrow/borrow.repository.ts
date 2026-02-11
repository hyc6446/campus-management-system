import { HttpStatus, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/borrow/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { BookRepository } from '@app/modules/book/book.repository'

@Injectable()
export class BorrowRepository {
  constructor(
    private prisma: PrismaService,
    private bookRepository: BookRepository
  ) {}

  /**
   * 获取书籍借阅列表（分页）
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
    where: Prisma.BorrowWhereInput,
    orderBy: Prisma.BorrowOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_BORROW_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.borrow.findMany({
        where,
        skip,
        take,
        orderBy,
        select: pt.DEFAULT_BORROW_FIELDS,
      }),
      this.prisma.borrow.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取书籍借阅（可选）
   * @param id 书籍借阅ID
   * @returns 书籍借阅详情或null
   */
  async findById(id: number): Promise<pt.SAFE_BORROW_TYPE | null> {
    const data = await this.prisma.borrow.findUnique({
      where: { id },
      select: pt.SAFE_BORROW_FIELDS,
    })
    if (!data) throw new AppException('书籍借阅不存在', 'Borrow_Not_Found', HttpStatus.NOT_FOUND)
    return data
  }

  async findByIdOptional(id: number): Promise<pt.SAFE_BORROW_TYPE | null> {
    return this.prisma.borrow.findUnique({
      where: { id },
      select: pt.SAFE_BORROW_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_BORROW_TYPE | null> {
    return await this.prisma.borrow.findUnique({
      where: { id },
      select: pt.FULL_BORROW_FIELDS,
    })
  }
  /**
   * 创建新书籍借阅
   * @param data 书籍借阅数据
   * @returns 创建的书籍借阅
   */
  async create(data: CreateDto, tx?: Prisma.TransactionClient): Promise<pt.DEFAULT_BORROW_TYPE> {
    return await (tx || this.prisma).borrow.create({
      data,
      select: pt.DEFAULT_BORROW_FIELDS,
    })
  }

  /**
   * 更新书籍借阅
   * @param id 书籍借阅ID
   * @param data 更新数据
   * @returns 更新后的书籍借阅
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_BORROW_TYPE> {
    return await this.prisma.borrow.update({
      where: { id },
      data,
      select: pt.DEFAULT_BORROW_FIELDS,
    })
  }

  /**
   * 删除书籍借阅（软删除）
   * @param id 书籍借阅ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const deletedBookBorrow = await this.prisma.borrow.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: pt.SAFE_BORROW_FIELDS,
    })
    return deletedBookBorrow !== null
  }

  /**
   * 恢复已删除书籍借阅
   * @param id 书籍借阅ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const data = await this.prisma.borrow.update({
      where: { id },
      data: { deletedAt: null },
      select: pt.SAFE_BORROW_FIELDS,
    })
    return data !== null
  }

  /**
   * 借阅书籍
   * @param data 书籍借阅数据
   * @returns 创建的书籍借阅
   */
  async borrow(data: CreateDto): Promise<pt.DEFAULT_BORROW_TYPE> {
    return this.prisma.$transaction(async tx => {
      const bookReservation = await this.create(data, tx)
      await this.bookRepository.reserve(bookReservation.bookId, tx)
      return bookReservation
    })
  }
}

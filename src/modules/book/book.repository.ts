import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/book/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取书籍列表（分页）
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
    where: Prisma.BookWhereInput,
    orderBy: Prisma.BookOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_BOOK_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.book.findMany({ where, skip, take, orderBy, select: pt.DEFAULT_BOOK_FIELDS }),
      this.prisma.book.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取书籍（可选）
   * @param id 书籍ID
   * @returns 书籍详情或null
   */
  async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_BOOK_TYPE | null> {
    return this.prisma.book.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_BOOK_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_BOOK_TYPE | null> {
    return this.prisma.book.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_BOOK_FIELDS,
    })
  }
  /**
   * 根据ISBN获取书籍（可选）
   * @param isbn 书籍ISBN
   * @returns 书籍详情或null
   */
  async findByIsbnOptional(isbn: string): Promise<pt.DEFAULT_BOOK_TYPE | null> {
    return this.prisma.book.findUnique({
      where: { isbn, deletedAt: null },
      select: pt.DEFAULT_BOOK_FIELDS,
    })
  }
  /**
   * 创建新书籍
   * @param data 书籍数据
   * @returns 创建的书籍
   */
  async create(data: CreateDto): Promise<pt.DEFAULT_BOOK_TYPE> {
    return this.prisma.book.create({
      data,
      select: pt.DEFAULT_BOOK_FIELDS,
    })
  }

  /**
   * 更新书籍
   * @param id 书籍ID
   * @param data 更新数据
   * @returns 更新后的书籍
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_BOOK_TYPE> {
    return this.prisma.book.update({
      where: { id },
      data,
      select: pt.DEFAULT_BOOK_FIELDS,
    })
  }

  /**
   * 删除书籍（软删除）
   * @param id 书籍ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const book = await this.prisma.book.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return book !== null
  }

  /**
   * 恢复已删除书籍
   * @param id 书籍ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const book = await this.prisma.book.update({
      where: { id },
      data: { deletedAt: null },
    })
    return book !== null
  }

  /**
   * 预约书籍
   * @param id 书籍ID
   * @param tx Prisma事务客户端
   * @returns 是否预约成功
   */
  async reserve(id: number, tx?: Prisma.TransactionClient): Promise<boolean> {
    const book = await (tx || this.prisma).book.update({
      where: { id },
      data: { stock: { decrement: 1 } },
    })
    return book !== null
  }
}

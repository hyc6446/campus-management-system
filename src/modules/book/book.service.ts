import { Injectable, HttpStatus } from '@nestjs/common'
import { BookRepository } from '@app/modules/book/book.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/book/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  /**
   * 获取书籍列表（分页）
   * @param query 查询参数
   * @returns 书籍列表和总数
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_BOOK_TYPE>> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      name,
      isbn,
      author,
      publicationYear,
      createdAt,
    } = query
    const skip = (page - 1) * take
    const where: Prisma.BookWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (name) where.name = { contains: name }
    if (isbn) where.isbn = { contains: isbn }
    if (author) where.author = { contains: author }
    if (publicationYear) where.publicationYear = { gte: Number(publicationYear) }
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.BookOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.bookRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取书籍
   * @param id 书籍ID
   * @returns 书籍详情
   */
  async findById(id: number): Promise<pt.SAFE_BOOK_TYPE> {
    const book = await this.bookRepository.findByIdOptionalWithSafe(id)
    if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
    return book
  }

  /**
   * 根据ID获取书籍（可选）
   * @param id 书籍ID
   * @returns 书籍详情或null
   */
  async findByIdOptional(id: number): Promise<pt.SAFE_BOOK_TYPE | null> {
    return await this.bookRepository.findByIdOptionalWithSafe(id)
  }

  /**
   * 创建新书籍
   * @param data 书籍数据
   * @returns 创建的书籍
   */
  async create(data: CreateDto): Promise<pt.DEFAULT_BOOK_TYPE> {
    const book = await this.bookRepository.findByIsbnOptional(data.isbn)
    if (book) throw new AppException('书籍已存在', 'Book_Exist', HttpStatus.CONFLICT)
     
    return this.bookRepository.create(data)
  }

  /**
   * 更新书籍
   * @param id 书籍ID
   * @param data 更新数据
   * @returns 更新后的书籍
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_BOOK_TYPE> {
    const book = await this.bookRepository.findByIdOptionalWithFull(id)
    if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
    // 检查ISBN是否已存在（排除当前书籍）
    if (data.isbn) {
      const isbnExist = await this.bookRepository.findByIsbnOptional(data.isbn)
      if (isbnExist && isbnExist.id !== id)
        throw new AppException('ISBN已存在', 'Book_Exist', HttpStatus.CONFLICT)
    }
    // 检查书籍是否已删除
    if (book.deletedAt)
      throw new AppException('该数据已废弃', 'Book_Deleted', HttpStatus.BAD_REQUEST)

    return this.bookRepository.update(id, data)
  }

  /**
   * 删除书籍（软删除）
   * @param id 书籍ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const book = await this.bookRepository.findByIdOptionalWithFull(id)
    if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
    // 检查书籍是否已删除
    if (book.deletedAt)
      throw new AppException('该数据已废弃', 'Book_Deleted', HttpStatus.BAD_REQUEST)
    return this.bookRepository.delete(id)
  }

  /**
   * 恢复已删除书籍
   * @param id 书籍ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const book = await this.bookRepository.findByIdOptionalWithFull(id)
    if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
    // 检查书籍是否已恢复
    if (!book.deletedAt)
      throw new AppException('该数据未废弃', 'Book_Not_Deleted', HttpStatus.BAD_REQUEST)
    return this.bookRepository.restore(id)
  }

  // 预定书籍
  async reserve(id: number): Promise<boolean> {
    // const book = await this.bookRepository.findByIdOptionalWithFull(id)
    // if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
    // // 检查书籍是否已删除
    // if (book.deletedAt)
    //   throw new AppException('该数据已废弃', 'Book_Deleted', HttpStatus.BAD_REQUEST)
    // // 检查库存是否充足
    // if (book.stock <= 0)
    //   throw new AppException('库存不足', 'Book_Stock_Insufficient', HttpStatus.BAD_REQUEST)

    return this.bookRepository.reserve(id)
  }
}

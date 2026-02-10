import { Injectable, HttpStatus } from '@nestjs/common'
import { BookReservationRepository } from '@app/modules/book-reservation/book-reservation.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/book-reservation/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'
import { BookService } from '@app/modules/book/book.service'

@Injectable()
export class BookReservationService {
  constructor(
    private bookReservationRepository: BookReservationRepository,
    private bookService: BookService
  ) {}

  /**
   * 获取书籍预约列表（分页）
   * @param query 查询参数
   * @returns 书籍预约列表和总数
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_BOOK_RESERVATION_TYPE>> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      bookId,
      userId,
      status,
      createdAt,
    } = query
    const skip = (page - 1) * take
    const where: Prisma.BookReservationWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (bookId) where.bookId = bookId
    if (userId) where.userId = userId
    if (status) where.status = status
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.BookReservationOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.bookReservationRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取书籍预约详情
   * @param id 书籍预约ID
   * @returns 书籍预约详情
   */
  async findById(id: number): Promise<pt.SAFE_BOOK_RESERVATION_TYPE> {
    const bookReservation = await this.bookReservationRepository.findById(id)
    if (!bookReservation)
      throw new AppException('书籍预约不存在', 'Book_Reservation_No_Found', HttpStatus.NOT_FOUND)
    return bookReservation
  }

  /**
   * 根据ID获取书籍预约详情（可选）
   * @param id 书籍预约ID
   * @returns 书籍预约详情或null
   */
  async findByIdOptional(id: number): Promise<pt.SAFE_BOOK_RESERVATION_TYPE | null> {
    return await this.bookReservationRepository.findById(id)
  }

  /**
   * 创建新书籍预约
   * @param data 书籍预约数据
   * @returns 创建的书籍预约
   */
  async create(data: CreateDto, userId: number): Promise<pt.SAFE_BOOK_RESERVATION_TYPE> {
    // 检查用户是否为预约者
    const { bookId, userId: reserveUserId } = data
    if (userId !== reserveUserId)
      throw new AppException('无权限操作', 'Not_Allowed_Reserve', HttpStatus.BAD_REQUEST)
    // 检查预定的书籍是否存在
    const book = await this.bookService.findById(bookId)
    if (!book) throw new AppException('该书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否已预定该书籍
    const reserved = await this.bookReservationRepository.findByUserIdAndBookIdOptional(
      reserveUserId,
      bookId
    )
    if (reserved && reserved.length > 0)
      throw new AppException(
        '该用户已存在相应的预约',
        'Book_Reserved_By_User',
        HttpStatus.BAD_REQUEST
      )
    // 检查书籍库存是否足够
    if (book.stock < 1)
      throw new AppException('书籍库存不足', 'Book_Stock_Insufficient', HttpStatus.BAD_REQUEST)

    return this.bookReservationRepository.create(data)
  }

  /**
   * 更新书籍预约
   * @param id 书籍预约ID
   * @param data 更新数据
   * @returns 更新后的书籍预约
   */
  async update(
    userId: number,
    id: number,
    data: UpdateDto
  ): Promise<pt.SAFE_BOOK_RESERVATION_TYPE> {
    // 检查用户是否为预约者
    const reservation = await this.bookReservationRepository.findById(id)
    if (!reservation)
      throw new AppException('该预约不存在', 'Book_Reservation_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否为预约者
    if (reservation.userId !== userId)
      throw new AppException('不可更新他人预约', 'Not_Allowed_Update', HttpStatus.BAD_REQUEST)
    // 检查预约时间是否在未来
    if (data.reserveTime && data.reserveTime < new Date())
      throw new AppException('预约时间无效', 'Reserve_Time_Invalid', HttpStatus.BAD_REQUEST)
    // 检查过期时间是否在未来
    if (data.expireTime && data.expireTime < new Date())
      throw new AppException('过期时间无效', 'Expire_Time_Invalid', HttpStatus.BAD_REQUEST)
    // 检查过期时间是否晚于预约时间
    if (data.expireTime && data.expireTime < data.reserveTime)
      throw new AppException(
        '过期时间不可早于预约时间',
        'Expire_Time_Earlier_Than_Reserve_Time',
        HttpStatus.BAD_REQUEST
      )

    return this.bookReservationRepository.update(id, data)
  }

  /**
   * 删除书籍预约（软删除）
   * @param id 书籍预约ID
   * @returns 是否删除成功
   */
  async delete(userId: number, id: number): Promise<boolean> {
    // 检查该预约是否存在
    const data = await this.bookReservationRepository.findByIdOptionalWithFull(id)
    if (!data)
      throw new AppException('该预约不存在', 'Book_Reservation_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否为预约者
    if (data.userId !== userId)
      throw new AppException('无权限删除', 'Not_Allowed_Delete', HttpStatus.BAD_REQUEST)
    // 检查该预约是否已被删除
    if (data.deletedAt)
      throw new AppException('该预约已被删除', 'Book_Reservation_Deleted', HttpStatus.BAD_REQUEST)

    return this.bookReservationRepository.delete(id)
  }

  /**
   * 恢复已删除书籍预约
   * @param id 书籍预约ID
   * @returns 是否恢复成功
   */
  async restore(userId: number, id: number): Promise<boolean> {
    // 检查该预约是否存在
    const data = await this.bookReservationRepository.findByIdOptionalWithFull(id)
    if (!data)
      throw new AppException('该预约不存在', 'Book_Reservation_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否为预约者
    if (data.userId !== userId)
      throw new AppException('无权限恢复', 'Not_Allowed_Restore', HttpStatus.BAD_REQUEST)
    // 检查该预约是否已被恢复
    if (!data.deletedAt)
      throw new AppException(
        '该预约未被删除',
        'Book_Reservation_Not_Deleted',
        HttpStatus.BAD_REQUEST
      )

    return this.bookReservationRepository.restore(id)
  }
}

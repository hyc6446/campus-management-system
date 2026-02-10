import { Injectable, HttpStatus } from '@nestjs/common'
import { BorrowRepository } from '@app/modules/borrow/borrow.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/borrow/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma, BorrowStatus } from '@prisma/client'
import { BookService } from '@app/modules/book/book.service'

@Injectable()
export class BorrowService {
  constructor(
    private borrowRepository: BorrowRepository,
    private bookService: BookService
  ) {}

  /**
   * 获取书籍借阅列表（分页）
   * @param query 查询参数
   * @returns 书籍借阅列表和总数
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.SAFE_BORROW_TYPE>> {
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
    const where: Prisma.BorrowWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (bookId) where.bookId = bookId
    if (userId) where.userId = userId
    if (status) where.status = status
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.BorrowOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.borrowRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取书籍预约详情
   * @param id 书籍预约ID
   * @returns 书籍预约详情
   */
  async findById(id: number): Promise<pt.SAFE_BORROW_TYPE> {
    const borrow = await this.borrowRepository.findById(id)
    if (!borrow) throw new AppException('书籍借阅不存在', 'Borrow_No_Found', HttpStatus.NOT_FOUND)
    return borrow
  }

  /**
   * 根据ID获取书籍预约详情（可选）
   * @param id 书籍预约ID
   * @returns 书籍预约详情或null
   */
  async findByIdOptional(id: number): Promise<pt.SAFE_BORROW_TYPE | null> {
    return await this.borrowRepository.findById(id)
  }

  /**
   * 创建新书籍借阅
   * @param data 书籍借阅数据
   * @returns 创建的书籍借阅
   */
  async create(data: CreateDto, userId: number): Promise<pt.SAFE_BORROW_TYPE> {
    // 检查用户是否为借阅者
    const { bookId } = data
    if (userId !== data.userId)
      throw new AppException('不可为他人借阅书籍', 'Not_Allowed_Borrow', HttpStatus.BAD_REQUEST)
    // 检查预定的书籍是否存在
    const book = await this.bookService.findById(bookId)
    if (!book) throw new AppException('书籍不存在', 'Book_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否已借阅该书籍
    const borrow = await this.borrowRepository.findByIdOptional(bookId)
    if (borrow && borrow.userId === userId)
      throw new AppException('用户已借阅该书籍', 'Book_Borrowed_By_User', HttpStatus.BAD_REQUEST)
    // 检查书籍库存是否足够
    if (book.stock < 1)
      throw new AppException('书籍库存不足', 'Book_Stock_Insufficient', HttpStatus.BAD_REQUEST)

    return this.borrowRepository.create(data)
  }

  /**
   * 更新书籍借阅
   * @param id 书籍借阅ID
   * @param data 更新数据
   * @returns 更新后的书籍借阅
   */
  async update(user: pt.SAFE_USER_TYPE, id: number, data: UpdateDto): Promise<pt.SAFE_BORROW_TYPE> {
    // 检查借阅是否存在
    const borrow = await this.borrowRepository.findById(id)
    if (!borrow) throw new AppException('该借阅不存在', 'Borrow_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否为借阅者
    if (borrow.userId !== user.id)
      throw new AppException('不可更新他人借阅', 'Not_Allowed_Update', HttpStatus.BAD_REQUEST)
    // 检查借阅时间是否在未来
    if (data.borrowTime && new Date(data.borrowTime) < new Date())
      throw new AppException('借阅时间不能在过去', 'Borrow_Time_Invalid', HttpStatus.BAD_REQUEST)
    // 检查归还时间是否在未来
    if (data.dueDate && new Date(data.dueDate) < new Date())
      throw new AppException('到期时间不能在过去', 'Due_Time_Invalid', HttpStatus.BAD_REQUEST)

    // 检查归还时间是否在到期时间之前
    if (data.returnDate && new Date(data.returnDate) < new Date(data.dueDate!))
      throw new AppException(
        '归还时间不能在到期时间之前',
        'Return_Time_Invalid',
        HttpStatus.BAD_REQUEST
      )
    // 检查借阅状态是否为已归还
    if (borrow.status === BorrowStatus.RETURNED)
      throw new AppException(
        '已归还的借阅不可更新',
        'Borrow_Already_Returned',
        HttpStatus.BAD_REQUEST
      )

    return this.borrowRepository.update(id, data)
  }

  /**
   * 删除书籍借阅（软删除）
   * @param id 书籍借阅ID
   * @returns 是否删除成功
   */
  async delete(user: pt.SAFE_USER_TYPE, id: number): Promise<boolean> {
    // 检查该借阅是否存在
    const borrow = await this.borrowRepository.findByIdOptionalWithFull(id)
    if (!borrow) throw new AppException('该借阅不存在', 'Borrow_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否为借阅者
    if (borrow.userId !== user.id)
      throw new AppException('不可删除他人借阅', 'Not_Allowed_Delete', HttpStatus.BAD_REQUEST)
    // 检查借阅状态是否为已归还
    if (borrow.status === BorrowStatus.RETURNED)
      throw new AppException(
        '已归还的借阅不可删除',
        'Borrow_Already_Returned',
        HttpStatus.BAD_REQUEST
      )
    // 检查该借阅是否已被删除
    if (borrow.deletedAt)
      throw new AppException('该借阅已被删除', 'Borrow_Deleted', HttpStatus.BAD_REQUEST)

    return this.borrowRepository.delete(id)
  }

  /**
   * 恢复已删除书籍借阅
   * @param id 书籍借阅ID
   * @returns 是否恢复成功
   */
  async restore(user: pt.SAFE_USER_TYPE, id: number): Promise<boolean> {
    // 检查该借阅是否存在
    const borrow = await this.borrowRepository.findByIdOptionalWithFull(id)
    if (!borrow) throw new AppException('该借阅不存在', 'Borrow_No_Found', HttpStatus.NOT_FOUND)
    // 检查用户是否为借阅者
    if (borrow.userId !== user.id)
      throw new AppException('不可恢复他人借阅', 'Not_Allowed_Restore', HttpStatus.BAD_REQUEST)
    // 检查借阅状态是否为已归还
    if (borrow.status === BorrowStatus.RETURNED)
      throw new AppException(
        '已归还的借阅不可恢复',
        'Borrow_Already_Returned',
        HttpStatus.BAD_REQUEST
      )
    // 检查该借阅是否已被恢复
    if (!borrow.deletedAt)
      throw new AppException('该借阅未被删除', 'Borrow_Not_Deleted', HttpStatus.BAD_REQUEST)

    return this.borrowRepository.restore(id)
  }
}

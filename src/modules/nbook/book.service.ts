import { Injectable, HttpStatus } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { BookRepository } from './book.repository'
import { CreateDto, UpdateDto, QueryDto } from './dto'
import { Book } from './entities'
import { AppException } from '@app/common/exceptions/app.exception'

@Injectable()
export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async findAll(query: QueryDto): Promise<{ data: Book[]; total: number; page: number; take: number }> {
    const { page, limit, sortBy, order, id, name, isbn, author, publicationYear, createdAt } = query
    const skip = (page - 1) * limit
    const where: Prisma.BookWhereInput = { deletedAt: null }

    if (id) where.id = id
    if (name) where.name = { contains: name }
    if (isbn) where.isbn = { contains: isbn }
    if (author) where.author = { contains: author }
    if (publicationYear) where.publicationYear = { gte: Number(publicationYear) }
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }

    const orderBy: Prisma.BookOrderByWithRelationInput = { [sortBy]: order }

    const result = await this.bookRepository.findAll(page, limit, skip, where, orderBy)

    return {
      ...result,
      data: result.data,
    }
  }

  async findById(id: number): Promise<Book> {
    return this.bookRepository.findById(id)
  }

  async findByIdOptional(id: number): Promise<Book | null> {
    return this.bookRepository.findByIdOptional(id)
  }

  async findByIsbn(isbn: string): Promise<Book> {
    return this.bookRepository.findByIsbn(isbn)
  }

  async findByIsbnOptional(isbn: string): Promise<Book | null> {
    return this.bookRepository.findByIsbnOptional(isbn)
  }

  async create(data: CreateDto): Promise<Book> {
    const book = new Book(data)
    const validation = book.validate()
    if (!validation.valid) {
      throw new AppException(
        `图书数据验证失败: ${validation.errors.join(', ')}`,
        'VALIDATION_ERROR',
        HttpStatus.BAD_REQUEST
      )
    }

    const isbnExists = await this.bookRepository.existsByIsbn(data.isbn)
    if (isbnExists) {
      throw new AppException('ISBN已存在', 'BOOK_ISBN_EXISTS', HttpStatus.CONFLICT)
    }

    return this.bookRepository.create(data)
  }

  async update(id: number, data: UpdateDto): Promise<Book> {
    const book = await this.bookRepository.findById(id)

    if (data.isbn) {
      const isbnExists = await this.bookRepository.existsByIsbn(data.isbn, id)
      if (isbnExists) {
        throw new AppException('ISBN已存在', 'BOOK_ISBN_EXISTS', HttpStatus.CONFLICT)
      }
    }

    const updatedBook = new Book({ ...book.toPrismaInput(), ...data })
    const validation = updatedBook.validate()
    if (!validation.valid) {
      throw new AppException(
        `图书数据验证失败: ${validation.errors.join(', ')}`,
        'VALIDATION_ERROR',
        HttpStatus.BAD_REQUEST
      )
    }

    return this.bookRepository.update(id, data)
  }

  async delete(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id)

    if (!book.canBeDeleted()) {
      if (book.stock > 0) {
        throw new AppException('还有库存的图书不能删除', 'BOOK_HAS_STOCK', HttpStatus.BAD_REQUEST)
      }
      if (book.isDeleted()) {
        throw new AppException('图书已删除', 'BOOK_ALREADY_DELETED', HttpStatus.BAD_REQUEST)
      }
    }

    book.delete()
    return this.bookRepository.delete(id)
  }

  async restore(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id)

    if (!book.isDeleted()) {
      throw new AppException('图书未删除，无需恢复', 'BOOK_NOT_DELETED', HttpStatus.BAD_REQUEST)
    }

    book.restore()
    return this.bookRepository.restore(id)
  }

  async borrow(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id)

    if (!book.canBeBorrowed()) {
      if (book.stock <= 0) {
        throw new AppException('库存不足，无法借阅', 'BOOK_OUT_OF_STOCK', HttpStatus.BAD_REQUEST)
      }
      if (book.isDeleted()) {
        throw new AppException('图书已删除，无法借阅', 'BOOK_DELETED', HttpStatus.BAD_REQUEST)
      }
    }

    book.borrow()
    await this.bookRepository.updateStock(id, -1)
    return this.bookRepository.findById(id)
  }

  async returnBook(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id)

    if (book.stock >= 100) {
      throw new AppException('库存已达上限，无法归还', 'BOOK_STOCK_LIMIT', HttpStatus.BAD_REQUEST)
    }

    book.returnBook()
    await this.bookRepository.updateStock(id, 1)
    return this.bookRepository.findById(id)
  }

  async restock(id: number, quantity: number): Promise<Book> {
    const book = await this.bookRepository.findById(id)

    if (!book.canBeRestocked()) {
      throw new AppException('图书已删除或库存已达上限', 'BOOK_CANNOT_RESTOCK', HttpStatus.BAD_REQUEST)
    }

    book.restock(quantity)
    await this.bookRepository.updateStock(id, quantity)
    return this.bookRepository.findById(id)
  }

  async getBookStatus(id: number): Promise<{ status: string; statusLabel: string; stock: number }> {
    const book = await this.bookRepository.findById(id)
    return {
      status: book.status,
      statusLabel: book.statusLabel,
      stock: book.stock,
    }
  }

  async search(keyword: string): Promise<Book[]> {
    const books = await this.bookRepository.findSummaries({ deletedAt: null })
    return books.filter(book => book.matchesKeyword(keyword))
  }

  async getRestockSuggestions(): Promise<Array<{ book: Book; quantity: number }>> {
    const books = await this.bookRepository.findSummaries({ deletedAt: null })
    return books
      .filter(book => book.needsRestock())
      .map(book => ({
        book,
        quantity: book.calculateRestockQuantity(),
      }))
  }

  async getDueDate(id: number, borrowDate?: Date): Promise<Date> {
    const book = await this.bookRepository.findById(id)
    return book.calculateDueDate(borrowDate)
  }

  async validateBook(data: CreateDto | UpdateDto): Promise<{ valid: boolean; errors: string[] }> {
    const book = new Book(data)
    return book.validate()
  }
}

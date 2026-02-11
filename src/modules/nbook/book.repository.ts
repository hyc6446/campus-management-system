import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { Book, BOOK_BASE_FIELDS, BOOK_PUBLIC_FIELDS, BOOK_SUMMARY_FIELDS } from './entities'
import type { CreateType, UpdateType } from './dto'

@Injectable()
export class BookRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.BookWhereInput,
    orderBy: Prisma.BookOrderByWithRelationInput
  ): Promise<{ data: Book[]; total: number; page: number; take: number }> {
    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take,
        orderBy,
        select: BOOK_BASE_FIELDS,
      }),
      this.prisma.book.count({ where }),
    ])
    return {
      data: Book.fromPrismaArray(data),
      total,
      page,
      take,
    }
  }

  async findById(id: number): Promise<Book> {
    const data = await this.prisma.book.findUnique({
      where: { id, deletedAt: null },
      select: BOOK_BASE_FIELDS,
    })
    if (!data) {
      throw new NotFoundException(`图书ID ${id} 不存在`)
    }
    return Book.fromPrisma(data)
  }

  async findByIdOptional(id: number): Promise<Book | null> {
    const data = await this.prisma.book.findUnique({
      where: { id, deletedAt: null },
      select: BOOK_BASE_FIELDS,
    })
    return data ? Book.fromPrisma(data) : null
  }

  async findByIsbn(isbn: string): Promise<Book> {
    const data = await this.prisma.book.findUnique({
      where: { isbn, deletedAt: null },
      select: BOOK_BASE_FIELDS,
    })
    if (!data) {
      throw new NotFoundException(`ISBN ${isbn} 不存在`)
    }
    return Book.fromPrisma(data)
  }

  async findByIsbnOptional(isbn: string): Promise<Book | null> {
    const data = await this.prisma.book.findUnique({
      where: { isbn, deletedAt: null },
      select: BOOK_BASE_FIELDS,
    })
    return data ? Book.fromPrisma(data) : null
  }

  async findPublic(id: number): Promise<Book> {
    const data = await this.prisma.book.findUnique({
      where: { id, deletedAt: null },
      select: BOOK_PUBLIC_FIELDS,
    })
    if (!data) {
      throw new NotFoundException(`图书ID ${id} 不存在`)
    }
    return Book.fromPrisma(data as any)
  }

  async findSummaries(where: Prisma.BookWhereInput): Promise<Book[]> {
    const data = await this.prisma.book.findMany({
      where,
      select: BOOK_SUMMARY_FIELDS,
    })
    return data.map(item => Book.fromPrisma(item as any))
  }

  async create(data: CreateType): Promise<Book> {
    const created = await this.prisma.book.create({
      data,
      select: BOOK_BASE_FIELDS,
    })
    return Book.fromPrisma(created)
  }

  async update(id: number, data: UpdateType): Promise<Book> {
    const updated = await this.prisma.book.update({
      where: { id },
      data,
      select: BOOK_BASE_FIELDS,
    })
    return Book.fromPrisma(updated)
  }

  async delete(id: number): Promise<Book> {
    const deleted = await this.prisma.book.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: BOOK_BASE_FIELDS,
    })
    return Book.fromPrisma(deleted)
  }

  async restore(id: number): Promise<Book> {
    const restored = await this.prisma.book.update({
      where: { id },
      data: { deletedAt: null },
      select: BOOK_BASE_FIELDS,
    })
    return Book.fromPrisma(restored)
  }

  async updateStock(id: number, quantity: number): Promise<Book> {
    const updated = await this.prisma.book.update({
      where: { id },
      data: { stock: { increment: quantity } },
      select: BOOK_BASE_FIELDS,
    })
    return Book.fromPrisma(updated)
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.book.count({
      where: { id, deletedAt: null },
    })
    return count > 0
  }

  async existsByIsbn(isbn: string, excludeId?: number): Promise<boolean> {
    const where: Prisma.BookWhereInput = {
      isbn,
      deletedAt: null,
    }
    if (excludeId) {
      where.id = { not: excludeId }
    }
    const count = await this.prisma.book.count({ where })
    return count > 0
  }

  async count(where: Prisma.BookWhereInput): Promise<number> {
    return this.prisma.book.count({ where })
  }

  async findManyByIds(ids: number[]): Promise<Book[]> {
    const data = await this.prisma.book.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      select: BOOK_BASE_FIELDS,
    })
    return Book.fromPrismaArray(data)
  }
}

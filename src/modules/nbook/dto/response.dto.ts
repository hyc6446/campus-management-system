import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'
import { Book } from '../entities'

const BookItemSchema = z.object({
  id: z.number().describe('图书ID'),
  isbn: z.string().describe('ISBN'),
  name: z.string().describe('图书名称'),
  subname: z.string().nullable().describe('副标题'),
  originalName: z.string().nullable().describe('原作名'),
  author: z.string().nullable().describe('作者'),
  publisher: z.string().nullable().describe('出版社'),
  publicationYear: z.number().nullable().describe('出版年份'),
  description: z.string().nullable().describe('描述'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(BookItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(BookItemSchema)) {}

export class BookSummaryDto {
  id!: number
  isbn!: string
  name!: string
  author!: string | null
  stock!: number

  static fromEntity(book: Book): BookSummaryDto {
    return {
      id: book.id,
      isbn: book.isbn,
      name: book.name,
      author: book.author,
      stock: book.stock,
    }
  }

  static fromEntities(books: Book[]): BookSummaryDto[] {
    return books.map(book => BookSummaryDto.fromEntity(book))
  }
}

export class BookDetailDto {
  id!: number
  isbn!: string
  name!: string
  fullName!: string
  displayName!: string
  subname!: string | null
  originalName!: string | null
  author!: string | null
  publisher!: string | null
  publicationYear!: number | null
  description!: string | null
  stock!: number
  stockLevel!: 'high' | 'medium' | 'low' | 'empty'
  status!: string
  statusLabel!: string
  isNew!: boolean
  isOld!: boolean
  publicationInfo!: string
  createdAt!: string
  updatedAt!: string | null

  static fromEntity(book: Book): BookDetailDto {
    return {
      id: book.id,
      isbn: book.isbn,
      name: book.name,
      fullName: book.fullName,
      displayName: book.displayName,
      subname: book.subname,
      originalName: book.originalName,
      author: book.author,
      publisher: book.publisher,
      publicationYear: book.publicationYear,
      description: book.description,
      stock: book.stock,
      stockLevel: book.stockLevel,
      status: book.status,
      statusLabel: book.statusLabel,
      isNew: book.isNew,
      isOld: book.isOld,
      publicationInfo: book.publicationInfo,
      createdAt: book.createdAt.toISOString(),
      updatedAt: book.updatedAt?.toISOString() ?? null,
    }
  }
}

export class BookFrontendDto {
  id!: number
  isbn!: string
  name!: string
  fullName!: string
  displayName!: string
  subname!: string | null
  originalName!: string | null
  author!: string | null
  publisher!: string | null
  publicationYear!: number | null
  description!: string | null
  stock!: number
  stockLevel!: 'high' | 'medium' | 'low' | 'empty'
  status!: string
  statusLabel!: string
  isNew!: boolean
  isOld!: boolean
  publicationInfo!: string
  createdAt!: string
  updatedAt!: string | undefined

  static fromEntity(book: Book): BookFrontendDto {
    return book.toFrontendFormat()
  }

  static fromEntities(books: Book[]): BookFrontendDto[] {
    return books.map(book => BookFrontendDto.fromEntity(book))
  }
}

import type { Prisma } from '@prisma/client'

export const BOOK_TABLE_FIELDS = [
  'id',
  'isbn',
  'name',
  'subname',
  'originalName',
  'author',
  'publisher',
  'publicationYear',
  'stock',
  'description',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

export const DEFAULT_BOOK_FIELDS = {
  id: true,
  name: true,
  isbn: true,
  subname: true,
  originalName: true,
  author: true,
  publisher: true,
  publicationYear: true,
  description: true,
  stock: true,
  createdAt: true,
} satisfies Prisma.BookSelect

export const SAFE_BOOK_FIELDS = {
  ...DEFAULT_BOOK_FIELDS,
  updatedAt: true,
} satisfies Prisma.BookSelect

export const FULL_BOOK_FIELDS = {
  ...SAFE_BOOK_FIELDS,
  deletedAt: true,
} satisfies Prisma.BookSelect

// 允许的查询筛选字段
export const BOOK_ALLOWED_FILTER_FIELDS = [
  'id',
  'name',
  'isbn',
  'author',
  'publicationYear',
  'createdAt',
] as const
// 允许的排序字段
export const BOOK_ALLOWED_SORT_FIELDS = ['id', 'isbn', 'createdAt']

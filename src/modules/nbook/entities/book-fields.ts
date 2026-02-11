import type { Prisma } from '@prisma/client'

// 基础字段
export const BOOK_BASE_FIELDS = {
  id: true,
  isbn: true,
  name: true,
  subname: true,
  originalName: true,
  author: true,
  publisher: true,
  publicationYear: true,
  stock: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const satisfies Prisma.BookSelect

// 公开字段
export const BOOK_PUBLIC_FIELDS = {
  id: true,
  isbn: true,
  name: true,
  subname: true,
  originalName: true,
  author: true,
  publisher: true,
  publicationYear: true,
  description: true,
  createdAt: true,
} as const satisfies Prisma.BookSelect

// 摘要字段
export const BOOK_SUMMARY_FIELDS = {
  id: true,
  isbn: true,
  name: true,
  author: true,
  stock: true,
} as const satisfies Prisma.BookSelect

// 管理员字段
export const BOOK_ADMIN_FIELDS = {
  ...BOOK_PUBLIC_FIELDS,
  stock: true,
  updatedAt: true,
} as const satisfies Prisma.BookSelect

export type BookBaseType = Prisma.BookGetPayload<{ select: typeof BOOK_BASE_FIELDS }>
export type BookPublicType = Prisma.BookGetPayload<{ select: typeof BOOK_PUBLIC_FIELDS }>
export type BookSummaryType = Prisma.BookGetPayload<{ select: typeof BOOK_SUMMARY_FIELDS }>
export type BookAdminType = Prisma.BookGetPayload<{ select: typeof BOOK_ADMIN_FIELDS }>

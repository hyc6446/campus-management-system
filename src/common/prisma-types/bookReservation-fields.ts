import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const BOOK_RESERVATION_TABLE_FIELDS = [
  'id',
  'bookId',
  'userId',
  'status',
  'reserveTime',
  'expireTime',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 BookReservation 自身字段）
export const DEFAULT_BOOK_RESERVATION_FIELDS = {
  id: true,
  bookId: true,
  userId: true,
  status: true,
  reserveTime: true,
  expireTime: true,
  createdAt: true,
} satisfies Prisma.BookReservationSelect

export const SAFE_BOOK_RESERVATION_FIELDS = {
  ...DEFAULT_BOOK_RESERVATION_FIELDS,
  updatedAt: true,
} satisfies Prisma.BookReservationSelect

export const FULL_BOOK_RESERVATION_FIELDS = {
  ...SAFE_BOOK_RESERVATION_FIELDS,  
  deletedAt: true,
} satisfies Prisma.BookReservationSelect

// 允许的查询筛选字段
export const BOOK_RESERVATION_ALLOWED_FILTER_FIELDS = [
  'id',
  'bookId',
  'userId',
  'status',
  'createdAt',
] as const
// 允许的排序字段
export const BOOK_RESERVATION_ALLOWED_SORT_FIELDS = ['id', 'createdAt']

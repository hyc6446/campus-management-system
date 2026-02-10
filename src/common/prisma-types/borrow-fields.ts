import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const BORROW_TABLE_FIELDS = [
  'id',
  'bookId',
  'userId',
  'status',
  'borrowDate',
  'dueDate',
  'returnDate',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 Borrow 自身字段）
export const DEFAULT_BORROW_FIELDS = {
  id: true,
  bookId: true,
  userId: true,
  status: true,
  borrowDate: true,
  dueDate: true,
  returnDate: true,
  createdAt: true,
} satisfies Prisma.BorrowSelect

export const SAFE_BORROW_FIELDS = {
  ...DEFAULT_BORROW_FIELDS,
  updatedAt: true,
} satisfies Prisma.BorrowSelect

export const FULL_BORROW_FIELDS = {
  ...SAFE_BORROW_FIELDS,
  deletedAt: true,
} satisfies Prisma.BorrowSelect

// 允许的查询筛选字段
export const BORROW_ALLOWED_FILTER_FIELDS = [
  'id',
  'bookId',
  'userId',
  'status',
  'createdAt',
] as const
// 允许的排序字段
export const BORROW_ALLOWED_SORT_FIELDS = ['id', 'bookId', 'userId', 'createdAt']

import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const LIBRARY_SEAT_TABLE_FIELDS = [
  'id',
  'seatNumber',
  'location',
  'status',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 LibrarySeat 自身字段）
export const DEFAULT_LIBRARY_SEAT_FIELDS = {
  id: true,
  seatNumber: true,
  location: true,
  status: true,
  createdAt: true,
} satisfies Prisma.LibrarySeatSelect

export const SAFE_LIBRARY_SEAT_FIELDS = {
  ...DEFAULT_LIBRARY_SEAT_FIELDS,
  updatedAt: true,
} satisfies Prisma.LibrarySeatSelect

export const FULL_LIBRARY_SEAT_FIELDS = {
  ...SAFE_LIBRARY_SEAT_FIELDS,  
  deletedAt: true,
} satisfies Prisma.LibrarySeatSelect

// 允许的查询筛选字段
export const LIBRARY_SEAT_ALLOWED_FILTER_FIELDS = [
  'id',
  'seatNumber',
  'status',
  'createdAt',
] as const
// 允许的排序字段
export const LIBRARY_SEAT_ALLOWED_SORT_FIELDS = ['id', 'createdAt']

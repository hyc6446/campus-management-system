import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const CLASS_TABLE_FIELDS = [
  'id',
  'name',
  'description',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 Class 自身字段）
export const DEFAULT_CLASS_FIELDS = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
} satisfies Prisma.ClassSelect

export const SAFE_CLASS_FIELDS = {
  ...DEFAULT_CLASS_FIELDS,
  updatedAt: true,
} satisfies Prisma.ClassSelect

export const FULL_CLASS_FIELDS = {
  ...SAFE_CLASS_FIELDS,
  deletedAt: true,
} satisfies Prisma.ClassSelect

// 允许的查询筛选字段
export const CLASS_ALLOWED_FILTER_FIELDS = ['id', 'name', 'createdAt'] as const
// 允许的排序字段
export const CLASS_ALLOWED_SORT_FIELDS = ['id', 'createdAt']

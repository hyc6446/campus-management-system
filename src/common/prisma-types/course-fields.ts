import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const COURSE_TABLE_FIELDS = [
  'id',
  'name',
  'credit',
  'description',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 Course 自身字段）
export const DEFAULT_COURSE_FIELDS = {
  id: true,
  name: true,
  credit: true,
  description: true,
  createdAt: true,
} satisfies Prisma.CourseSelect

export const SAFE_COURSE_FIELDS = {
  ...DEFAULT_COURSE_FIELDS,
  updatedAt: true,
} satisfies Prisma.CourseSelect

export const FULL_COURSE_FIELDS = {
  ...SAFE_COURSE_FIELDS,    
  deletedAt: true,
} satisfies Prisma.CourseSelect

// 允许的查询筛选字段
export const COURSE_ALLOWED_FILTER_FIELDS = ['id', 'name', 'createdAt'] as const
// 允许的排序字段
export const COURSE_ALLOWED_SORT_FIELDS = ['id', 'createdAt']

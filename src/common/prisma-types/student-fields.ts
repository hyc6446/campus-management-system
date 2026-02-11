import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const STUDENT_TABLE_FIELDS = [
  'id',
  'name',
  'password',
  'phone',
  'cardId',
  'classId',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 Student 自身字段）
export const DEFAULT_STUDENT_FIELDS = {
  id: true,
  name: true,
  phone: true,
  cardId: true,
  classId: true,
  createdAt: true,
} satisfies Prisma.StudentSelect

export const SAFE_STUDENT_FIELDS = {
  ...DEFAULT_STUDENT_FIELDS,
  updatedAt: true,
} satisfies Prisma.StudentSelect

export const FULL_STUDENT_FIELDS = {
  ...SAFE_STUDENT_FIELDS,
  password: true,
  deletedAt: true,
} satisfies Prisma.StudentSelect

// 允许的查询筛选字段
export const STUDENT_ALLOWED_FILTER_FIELDS = [
  'id',
  'name',
  'classId',
  'createdAt',
] as const
// 允许的排序字段
export const STUDENT_ALLOWED_SORT_FIELDS = ['id', 'classId', 'createdAt']

import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const COURSE_ENROLLMENT_TABLE_FIELDS = [
  'id',
  'courseId',
  'userId',
  'teachingId',
  'status',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 CourseEnrollment 自身字段）
export const DEFAULT_COURSE_ENROLLMENT_FIELDS = {
  id: true,
  courseId: true,
  userId: true,
  teachingId: true,
  status: true,
  createdAt: true,
} satisfies Prisma.CourseEnrollmentSelect 

export const SAFE_COURSE_ENROLLMENT_FIELDS = {
  ...DEFAULT_COURSE_ENROLLMENT_FIELDS,
  updatedAt: true,
} satisfies Prisma.CourseEnrollmentSelect

export const FULL_COURSE_ENROLLMENT_FIELDS = {
  ...SAFE_COURSE_ENROLLMENT_FIELDS,
  deletedAt: true,
} satisfies Prisma.CourseEnrollmentSelect   

// 允许的查询筛选字段
export const COURSE_ENROLLMENT_ALLOWED_FILTER_FIELDS = [
  'id',
  'courseId',
  'userId',
  'teachingId',
  'status',
  'createdAt',
] as const
// 允许的排序字段
export const COURSE_ENROLLMENT_ALLOWED_SORT_FIELDS = ['id', 'status', 'createdAt']

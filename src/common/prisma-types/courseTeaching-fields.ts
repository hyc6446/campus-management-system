import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const COURSE_TEACHING_TABLE_FIELDS = [
  'id',
  'courseId',
  'teacherId',
  'semester',
  'year',
  'startTime',
  'endTime',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 CourseTeaching 自身字段）
export const DEFAULT_COURSE_TEACHING_FIELDS = {
  id: true,
  courseId: true,
  teacherId: true,
  semester: true,
  year: true,
  startTime: true,
  endTime: true,
  createdAt: true,
} satisfies Prisma.CourseTeachingSelect

export const SAFE_COURSE_TEACHING_FIELDS = {
  ...DEFAULT_COURSE_TEACHING_FIELDS,
  updatedAt: true,
} satisfies Prisma.CourseTeachingSelect

export const FULL_COURSE_TEACHING_FIELDS = {
  ...SAFE_COURSE_TEACHING_FIELDS,    
  deletedAt: true,
} satisfies Prisma.CourseTeachingSelect

// 允许的查询筛选字段
export const COURSE_TEACHING_ALLOWED_FILTER_FIELDS = ['id', 'courseId', 'teacherId', 'year', 'createdAt'] as const
// 允许的排序字段
export const COURSE_TEACHING_ALLOWED_SORT_FIELDS = ['id', 'createdAt']

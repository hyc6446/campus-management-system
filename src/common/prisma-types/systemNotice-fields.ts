import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）

export const SYSTEM_NOTICE_TABLE_FIELDS = [
  'id',
  'type',
  'publisherId',
  'title',
  'content',
  'expireAt',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 SystemNotice 自身字段）
export const DEFAULT_SYSTEM_NOTICE_FIELDS = {
  id: true,
  type: true,
  publisherId: true,
  title: true,
  content: true,
  expireAt: true,
  createdAt: true,
} satisfies Prisma.SystemNoticeSelect

export const SAFE_SYSTEM_NOTICE_FIELDS = {
  ...DEFAULT_SYSTEM_NOTICE_FIELDS,    
  updatedAt: true,
} satisfies Prisma.SystemNoticeSelect

export const FULL_SYSTEM_NOTICE_FIELDS = {
  ...SAFE_SYSTEM_NOTICE_FIELDS,
  deletedAt: true,
} satisfies Prisma.SystemNoticeSelect

// 允许的查询筛选字段
export const SYSTEM_NOTICE_ALLOWED_FILTER_FIELDS = [
  'id',
  'title',
  'createdAt',
] as const
// 允许的排序字段
export const SYSTEM_NOTICE_ALLOWED_SORT_FIELDS = ['id', 'createdAt']

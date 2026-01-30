import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）
const TOKEN_TABLE_FIELDS = [
  'id',
  'userId',
  'token',
  'type',
  'expiresAt',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 Token 自身字段，不包含其他关联）
const DEFAULT_TOKEN_FIELDS = {
  id: true,
  userId: true,
  type: true,
  createdAt: true,
} satisfies Prisma.TokenSelect

const SAFE_TOKEN_FIELDS = {
  ...DEFAULT_TOKEN_FIELDS,
  updatedAt: true,
} satisfies Prisma.TokenSelect

const FULL_TOKEN_FIELDS = {
  ...SAFE_TOKEN_FIELDS,
  token: true,
  expiresAt: true,
  deletedAt: true,
} satisfies Prisma.TokenSelect

// 允许的查询筛选字段
const TOKEN_ALLOWED_FILTER_FIELDS = ['id', 'userId', 'type', 'deletedAt'] as const
// 允许的排序字段
const TOKEN_ALLOWED_SORT_FIELDS = ['id', 'createdAt']

export {
  TOKEN_TABLE_FIELDS,
  DEFAULT_TOKEN_FIELDS,
  SAFE_TOKEN_FIELDS,
  FULL_TOKEN_FIELDS,
  TOKEN_ALLOWED_FILTER_FIELDS,
  TOKEN_ALLOWED_SORT_FIELDS,
}

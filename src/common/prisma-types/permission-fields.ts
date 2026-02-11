import type { Prisma } from '@prisma/client'

// 字段列表（用于工具函数，可选）
const PERMISSION_TABLE_FIELDS = [
  'id',
  'action',
  'subject',
  'roleId',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const

// 预设字段对象（只包含 Permission 自身字段）
const DEFAULT_PERMISSION_FIELDS = {
  id: true,
  action: true,
  subject: true,
  roleId: true,
  createdAt: true,
} satisfies Prisma.PermissionSelect

const SAFE_PERMISSION_FIELDS = {
  ...DEFAULT_PERMISSION_FIELDS,
  updatedAt: true,
} satisfies Prisma.PermissionSelect

const FULL_PERMISSION_FIELDS = {
  ...SAFE_PERMISSION_FIELDS,
  deletedAt: true,
} satisfies Prisma.PermissionSelect

// 允许的查询筛选字段
const PERMISSION_ALLOWED_FILTER_FIELDS = ['id', 'action', 'subject', 'roleId', 'createdAt'] as const
// 允许的排序字段
const PERMISSION_ALLOWED_SORT_FIELDS = ['id', 'createdAt']

export {
  PERMISSION_TABLE_FIELDS,
  DEFAULT_PERMISSION_FIELDS,
  SAFE_PERMISSION_FIELDS,
  FULL_PERMISSION_FIELDS,
  PERMISSION_ALLOWED_FILTER_FIELDS,
  PERMISSION_ALLOWED_SORT_FIELDS,
}

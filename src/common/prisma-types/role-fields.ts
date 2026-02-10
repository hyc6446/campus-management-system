import type { Prisma } from '@prisma/client';

// 字段列表（用于工具函数，可选）
const ROLE_TABLE_FIELDS = [ "id", "name", "createdAt", "updatedAt", "deletedAt"] as const;

// 预设字段对象（只包含 Role 自身字段，不包含 role 等关联）
const DEFAULT_ROLE_FIELDS = {
  id: true,
  name: true,
} satisfies Prisma.RoleSelect;

const SAFE_ROLE_FIELDS = {
  ...DEFAULT_ROLE_FIELDS,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RoleSelect;

const FULL_ROLE_FIELDS = {
  ...SAFE_ROLE_FIELDS,
  deletedAt: true,
} satisfies Prisma.RoleSelect;

// 允许的查询筛选字段
const ROLE_ALLOWED_FILTER_FIELDS = [ "id", "name", "createdAt" ] as const;
// 允许的排序字段
const ROLE_ALLOWED_SORT_FIELDS = [ "id", "createdAt" ];

export {
  ROLE_TABLE_FIELDS,
  DEFAULT_ROLE_FIELDS,
  SAFE_ROLE_FIELDS,
  FULL_ROLE_FIELDS,
  ROLE_ALLOWED_FILTER_FIELDS,
  ROLE_ALLOWED_SORT_FIELDS,
}
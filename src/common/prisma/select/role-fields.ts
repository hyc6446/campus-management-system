import type { Prisma } from '@prisma/client';

// 字段列表（用于工具函数，可选）
export const ROLE_TABLE_FIELDS = [ "id", "name", "createdAt", "updatedAt", "deletedAt"] as const;

// 预设字段对象（只包含 User 自身字段，不包含 role 等关联）
export const DEFAULT_ROLE_FIELDS = {
  id: true,
  name: true,
} satisfies Prisma.RoleSelect;

export const DEFAULT_SAFE_ROLE_FIELDS = {
  ...DEFAULT_ROLE_FIELDS,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RoleSelect;

export const DEFAULT_ROLE_FULL_FIELDS = {
  ...DEFAULT_SAFE_ROLE_FIELDS,
  updatedAt: true,
} satisfies Prisma.RoleSelect;

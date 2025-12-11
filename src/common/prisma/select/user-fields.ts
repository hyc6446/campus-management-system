import type { Prisma } from '@prisma/client';

// 字段列表（用于工具函数，可选）
export const USER_TABLE_FIELDS = [
  'id',
  'email',
  'password',
  'userName',
  'avatarUrl',
  'phone',
  'roleId',
  'failedLoginAttempts',
  'lockUntil',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

// 预设字段对象（只包含 User 自身字段，不包含 role 等关联）
export const DEFAULT_USER_FIELDS = {
  id: true,
  email: true,
  userName: true,
  avatarUrl: true,
  phone: true,
  roleId: true,
  createdAt: true,
  deletedAt: true,
} satisfies Prisma.UserSelect;

export const DEFAULT_SAFE_USER_FIELDS = {
  ...DEFAULT_USER_FIELDS,
  failedLoginAttempts: true,
  lockUntil: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export const DEFAULT_USER_FULL_FIELDS = {
  ...DEFAULT_SAFE_USER_FIELDS,
  password: true,
} satisfies Prisma.UserSelect;
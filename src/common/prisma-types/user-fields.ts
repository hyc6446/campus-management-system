import type { Prisma } from '@prisma/client';

// 字段列表（用于工具函数，可选）
 const USER_TABLE_FIELDS = [
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
 const DEFAULT_USER_FIELDS = {
  id: true,
  email: true,
  userName: true,
  avatarUrl: true,
  phone: true,
  roleId: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

 const SAFE_USER_FIELDS = {
  ...DEFAULT_USER_FIELDS,
  failedLoginAttempts: true,
  lockUntil: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.UserSelect;

 const FULL_USER_FIELDS = {
  ...SAFE_USER_FIELDS,
  password: true,
} satisfies Prisma.UserSelect;

// 允许的查询筛选字段
const USER_ALLOWED_FILTER_FIELDS = [ "id", "email", "userName","phone","roleId", "createdAt"] as const;
// 允许的排序字段
const USER_ALLOWED_SORT_FIELDS = [ "id", "createdAt" ];

export {
  USER_TABLE_FIELDS,
  DEFAULT_USER_FIELDS,
  SAFE_USER_FIELDS,
  FULL_USER_FIELDS,
  USER_ALLOWED_FILTER_FIELDS,
  USER_ALLOWED_SORT_FIELDS,
}
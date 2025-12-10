import type{ Prisma } from "@prisma/client";
import { generateSelectExcept, generateFullSelect } from "@common/utils/peisma.util";
import { SAFE_ROLE } from "@common/types/entity/role.type";

export const PERMISSION_FIELDS= [
    "id",
    "action",
    "subject",
    "conditions",
    "roleId",
    "createdAt",
    "updatedAt",
    "deletedAt",
]


// 基础类型定义 - 与Prisma保持一致
export type PermissionSelect = Prisma.PermissionSelect
export type PermissionInclude = Prisma.PermissionInclude

// 简化的查询选项类型
export type PermissionFindOptions = { select?: PermissionSelect; include?: PermissionInclude; }

export type PermissionWithFields<T extends PermissionSelect | PermissionFindOptions> = 
    Prisma.PermissionGetPayload<{
        select: T extends PermissionFindOptions ? T['select'] : T,
        include: T extends PermissionFindOptions ? T['include'] : undefined
    }>

// 默认权限信息（基础字段）
export const DEFAULT_PERMISSION = generateFullSelect(PERMISSION_FIELDS) satisfies Prisma.PermissionSelect;

// 安全权限信息（公开信息）
export const SAFE_PERMISSION = generateSelectExcept(PERMISSION_FIELDS, ["updatedAt"]) satisfies Prisma.PermissionSelect;

// 带用户信息
export const SAFE_PERMISSION_WITH_USER = { 
    select: SAFE_PERMISSION, 
    include: SAFE_ROLE 
} satisfies PermissionFindOptions;

// ========================================================
// 预定义的返回类型（方便直接使用）
// ========================================================

export type DefaultPermission = PermissionWithFields<typeof DEFAULT_PERMISSION>
export type SafePermission = PermissionWithFields<typeof SAFE_PERMISSION>
export type SafePermissionWithUser = PermissionWithFields<typeof SAFE_PERMISSION_WITH_USER>

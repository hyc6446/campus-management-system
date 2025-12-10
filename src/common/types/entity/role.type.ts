import type{ Prisma } from "@prisma/client";
import { generateSelectExcept, generateFullSelect } from "@common/utils/peisma.util";
import {DEFAULT_SAFE_USER} from "@common/types/entity/user.type"


export const ROLE_FIELDS= [
    "id",
    "name",
    "createdAt",
    "updatedAt",
    "deletedAt",
]


// 基础类型定义 - 与Prisma保持一致
export type RoleSelect = Prisma.RoleSelect
export type RoleInclude = Prisma.RoleInclude

// 简化的查询选项类型
export type RoleFindOptions = { select?: RoleSelect; include?: RoleInclude; }

export type RoleWithFields<T extends RoleSelect | RoleFindOptions> = 
    Prisma.RoleGetPayload<{
        select: T extends RoleFindOptions ? T['select'] : T,
        include: T extends RoleFindOptions ? T['include'] : undefined
    }>

// 默认角色信息（基础字段）
export const DEFAULT_ROLE = generateFullSelect(ROLE_FIELDS) satisfies Prisma.RoleSelect;

// 安全角色信息（公开信息）
export const SAFE_ROLE = generateSelectExcept(ROLE_FIELDS, ["updatedAt"]) satisfies Prisma.RoleSelect;

// 带用户信息
export const SAFE_ROLE_WITH_USER = { 
    select: SAFE_ROLE, 
    include: DEFAULT_SAFE_USER 
} satisfies RoleFindOptions;

// 带权限信息
export const SAFE_ROLE_WITH_PERMISSIONS = { 
    select: SAFE_ROLE, 
    include: {
        permissions: true
    } 
} satisfies RoleFindOptions;

// 带角色和权限的用户信息
export const SAFE_ROLE_WITH_PERMISSIONS_AND_USER = { 
    select: SAFE_ROLE, 
    include: {
        permissions: true,
        users: DEFAULT_SAFE_USER
    } 
} satisfies RoleFindOptions;

// ========================================================
// 预定义的返回类型（方便直接使用）
// ========================================================

export type DefaultRole = RoleWithFields<typeof DEFAULT_ROLE>
export type SafeRole = RoleWithFields<typeof SAFE_ROLE>
export type SafeRoleWithUser = RoleWithFields<typeof SAFE_ROLE_WITH_USER>
export type SafeRoleWithPermissions = RoleWithFields<typeof SAFE_ROLE_WITH_PERMISSIONS>
export type SafeRoleWithPermissionsAndUser = RoleWithFields<typeof SAFE_ROLE_WITH_PERMISSIONS_AND_USER>

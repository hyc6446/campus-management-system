import type{ Prisma } from "@prisma/client";
import { generateSelect, generateSelectExcept, generateFullSelect } from "@common/utils/peisma.util";
import {DEFAULT_ROLE, SAFE_ROLE} from "@common/types/entity/role.type"


export const USER_FIELDS= [
  "id",
  "email",
  "password",
  "userName",
  "avatarUrl",
  "phone",
  "roleId",
  "failedLoginAttempts",
  "lockUntil",
  "createdAt",
  "updatedAt",
  "deletedAt",
]

// 基础类型定义 - 与Prisma保持一致
export type UserSelect = Prisma.UserSelect
export type UserInclude = Prisma.UserInclude

// 简化的查询选项类型
export type UserFindOptions = { select?: UserSelect; include?: UserInclude; }

// 核心的UserWithFields类型 - 智能适配不同的输入类型。支持：
// 1. UserWithFields<{ id: true, email: true }>               // 直接select
// 2. UserWithFields<{ select: { id: true }, include: { ... } }> // 完整查询选项
// 3. UserWithFields<typeof SAFE_USER>                         // 预定义常量
export type UserWithFields<T extends UserSelect | UserFindOptions> = 
    Prisma.UserGetPayload<{
        select: T extends UserFindOptions ? T['select'] : T,
        include: T extends UserFindOptions ? T['include'] : undefined
    }>


// ========================================================
// 推荐的预定义查询配置（根据实际业务需求调整）
// ========================================================

// 默认用户信息（基础字段）
export const DEFAULT_USER = generateFullSelect(USER_FIELDS) satisfies Prisma.UserSelect;

// 默认用户信息（基础字段，不包含密码）
export const DEFAULT_USER_WITHOUT_PASSWORD = generateSelectExcept(
    USER_FIELDS, 
    ["password"]
) satisfies Prisma.UserSelect;

// 安全用户信息（公开信息）
export const SAFE_USER = generateSelectExcept(
    USER_FIELDS, 
    ["password", "failedLoginAttempts", "lockUntil", "updatedAt"]
) satisfies Prisma.UserSelect;

export const DEFAULT_SAFE_USER_WITH_ROLE={
    select:{
        ...DEFAULT_USER
    },
    include: {
        role: DEFAULT_ROLE
    }
} satisfies UserFindOptions;

// 带角色的用户信息
export const SAFE_USER_WITH_ROLE = { 
    select: SAFE_USER, 
    include: {
        role: SAFE_ROLE
    } 
} satisfies UserFindOptions;


// ========================================================
// 预定义的返回类型（方便直接使用）
// ========================================================

export type DefaultUser = UserWithFields<typeof DEFAULT_USER>
export type SafeUser = UserWithFields<typeof SAFE_USER>
export type SafeUserWithRole = UserWithFields<typeof SAFE_USER_WITH_ROLE>


// ========================================================
// 使用示例（帮助理解）
// ========================================================
/*
// 使用方式1: 直接使用预定义类型
async function getUser(id: string): Promise<SafeUser> {
    return await prisma.user.findUnique({
        where: { id },
        ...SAFE_USER // 直接展开预定义配置
    })
}

// 使用方式2: 自定义返回结构
async function getCustomUser(id: string): Promise<UserWithFields<{ id: true, email: true }>> {
    return await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true } // 自定义字段
    })
}

// 使用方式3: 复杂查询（带include）
async function getUserWithRole(id: string): Promise<SafeUserWithRole> {
    return await prisma.user.findUnique({
        where: { id },
        ...SAFE_USER_WITH_ROLE // 直接使用预定义的复杂配置
    })
}
*/


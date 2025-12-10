import type{ Prisma } from "@prisma/client";
import { generateSelectExcept, generateFullSelect } from "@common/utils/peisma.util";
import {DEFAULT_ROLE, SAFE_ROLE} from "@common/types/entity/role.type"


// 用户字段列表
export const USER_FIELDS= [ "id", "email", "password", "userName", "avatarUrl", "phone", "roleId", "failedLoginAttempts", "lockUntil",  "createdAt", "updatedAt", "deletedAt",
]
// 基础类型定义 - 与Prisma保持一致
export type Select = Prisma.UserSelect
export type Include = Prisma.UserInclude
export type FindOptions = { select?: Select; include?: Include; }
export type WithFields= Prisma.UserGetPayload<{ select: Select; include: Include }> | null

//基础
// ========================================================
// 推荐的预定义查询配置（根据实际业务需求调整）
// ========================================================
// 默认用户信息（基础字段["id", "email", "password", "userName", "avatarUrl", "phone", "roleId", "failedLoginAttempts", "lockUntil",  "createdAt", "updatedAt", "deletedAt"]）
export const DEFAULT_USER = generateFullSelect(USER_FIELDS) satisfies Select;

// 默认用户信息不包含密码["id", "email", "userName", "avatarUrl", "phone", "roleId", "failedLoginAttempts", "lockUntil",  "createdAt", "updatedAt", "deletedAt"]
export const DEFAULT_USER_WITHOUT_PASSWORD = generateSelectExcept(USER_FIELDS, ["password"]) satisfies Select;

// 安全用户信息基本信息["id", "email", "userName", "avatarUrl", "phone", "roleId", "createdAt"]
export const DEFAULT_SAFE_USER = generateSelectExcept(USER_FIELDS, ["password", "failedLoginAttempts", "lockUntil", "updatedAt"]) satisfies Select;


// 默认安全用户信息包含角色
// User:["id", "email", "password", "userName", "avatarUrl", "phone", "roleId", "failedLoginAttempts", "lockUntil",  "createdAt", "updatedAt", "deletedAt"]
// Role:["id", "name", "createdAt", "updatedAt", "deletedAt"]
export const DEFAULT_SAFE_USER_WITH_ROLE_FULL={
    select:{
        ...DEFAULT_USER
    },
    include: {
        role: DEFAULT_ROLE
    }
} satisfies FindOptions;

// 带角色的用户信息
// User:["id", "email", "userName", "avatarUrl", "phone", "roleId", "createdAt"]
// Role:["id", "name", "createdAt", "deletedAt"]
export const DEFAULT_SAFE_USER_WITH_ROLE = { 
    select: DEFAULT_SAFE_USER, 
    include: {
        role: SAFE_ROLE
    } 
} satisfies FindOptions;


// ========================================================
// 预定义的返回类型（方便直接使用）
// ========================================================

export type DefaultUser = typeof DEFAULT_USER
export type DefaultSafeUser = typeof DEFAULT_SAFE_USER
export type DefaultSafeUserWithRole = typeof DEFAULT_SAFE_USER_WITH_ROLE
export type DefaultUserWithoutPassword = typeof DEFAULT_USER_WITHOUT_PASSWORD
export type DefaultSafeUserWithRoleFull = typeof DEFAULT_SAFE_USER_WITH_ROLE_FULL


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


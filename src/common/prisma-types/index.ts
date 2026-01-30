import * as UserFields from './user-fields'
import * as RoleFields from './role-fields'
import * as PermissionFields from './permission-fields'
import * as RuleConfigFields from './ruleConfig-fields'
import * as TokenFields from './token-fields'

import type { Prisma, User, Role, Permission, RuleConfig, Token } from '@prisma/client'


// 使用单独的重新导出语句
export * from './user-fields'
export * from './role-fields'
export * from './permission-fields'
export * from './ruleConfig-fields'
export * from './token-fields'



// 定义================ 基本用户 ===========类型
export type DEFAULT_USER_TYPE = { [K in keyof typeof UserFields.DEFAULT_USER_FIELDS]: User[K] }
export type SAFE_USER_TYPE = { [K in keyof typeof UserFields.SAFE_USER_FIELDS]: User[K] }
export type FULL_USER_TYPE = { [K in keyof typeof UserFields.FULL_USER_FIELDS]: User[K] }

// 用户过滤字段
export type ALLOWED_USER_FILTER_TYPE = (typeof UserFields.USER_ALLOWED_FILTER_FIELDS)[number]
// 用户排序字段
export type ALLOWED_USER_SORT_TYPE = (typeof UserFields.USER_ALLOWED_SORT_FIELDS)[number]

// 定义================ 基本角色 ===========类型
export type DEFAULT_ROLE_TYPE = {[K in keyof typeof RoleFields.DEFAULT_ROLE_FIELDS]: Role[K]}
export type SAFE_ROLE_TYPE = {[K in keyof typeof RoleFields.SAFE_ROLE_FIELDS]: Role[K]}
export type FULL_ROLE_TYPE = {[K in keyof typeof RoleFields.FULL_ROLE_FIELDS]: Role[K]}

// 角色过滤字段
export type ALLOWED_ROLE_FILTER_TYPE = (typeof RoleFields.ROLE_ALLOWED_FILTER_FIELDS)[number]
// 角色排序字段
export type ALLOWED_ROLE_SORT_TYPE = (typeof RoleFields.ROLE_ALLOWED_SORT_FIELDS)[number]

// 定义================ 基本权限 ===========类型
export type DEFAULT_PERMISSION_TYPE = {[K in keyof typeof PermissionFields.DEFAULT_PERMISSION_FIELDS]: Permission[K]}
export type SAFE_PERMISSION_TYPE = {[K in keyof typeof PermissionFields.SAFE_PERMISSION_FIELDS]: Permission[K]}
export type FULL_PERMISSION_TYPE = {[K in keyof typeof PermissionFields.FULL_PERMISSION_FIELDS]: Permission[K]}

// 权限过滤字段
export type ALLOWED_PERMISSION_FILTER_TYPE = (typeof PermissionFields.PERMISSION_ALLOWED_FILTER_FIELDS)[number]
// 权限排序字段
export type ALLOWED_PERMISSION_SORT_TYPE = (typeof PermissionFields.PERMISSION_ALLOWED_SORT_FIELDS)[number]

// 定义================ 基本规则配置 ===========类型
export type DEFAULT_RULE_CONFIG_TYPE = {[K in keyof typeof RuleConfigFields.DEFAULT_RULE_CONFIG_FIELDS]: RuleConfig[K]}
export type SAFE_RULE_CONFIG_TYPE = {[K in keyof typeof RuleConfigFields.SAFE_RULE_CONFIG_FIELDS]: RuleConfig[K]}
export type FULL_RULE_CONFIG_TYPE = {[K in keyof typeof RuleConfigFields.FULL_RULE_CONFIG_FIELDS]: RuleConfig[K]}

// 规则配置过滤字段
export type ALLOWED_RULE_CONFIG_FILTER_TYPE = (typeof RuleConfigFields.RULE_CONFIG_ALLOWED_FILTER_FIELDS)[number]
// 规则配置排序字段
export type ALLOWED_RULE_CONFIG_SORT_TYPE = (typeof RuleConfigFields.RULE_CONFIG_ALLOWED_SORT_FIELDS)[number]

// 定义================ 基本令牌 ===========类型
export type DEFAULT_TOKEN_TYPE = {[K in keyof typeof TokenFields.DEFAULT_TOKEN_FIELDS]: Token[K]}
export type SAFE_TOKEN_TYPE = {[K in keyof typeof TokenFields.SAFE_TOKEN_FIELDS]: Token[K]}
export type FULL_TOKEN_TYPE = {[K in keyof typeof TokenFields.FULL_TOKEN_FIELDS]: Token[K]}

// 令牌过滤字段
export type ALLOWED_TOKEN_FILTER_TYPE = (typeof TokenFields.TOKEN_ALLOWED_FILTER_FIELDS)[number]
// 令牌排序字段
export type ALLOWED_TOKEN_SORT_TYPE = (typeof TokenFields.TOKEN_ALLOWED_SORT_FIELDS)[number]



// 定义================ 混合字段数据 ===========类型
// 用户默认-角色默认 类型
export type USER_ROLE_DEFAULT_TYPE = DEFAULT_USER_TYPE & { role: DEFAULT_ROLE_TYPE }
// 用户默认-角色安全 类型
export type USER_DEFAULT_ROLE_SAFE_TYPE = DEFAULT_USER_TYPE & { role: SAFE_ROLE_TYPE }
// 用户默认-角色完整 类型
export type USER_DEFAULT_ROLE_FULL_TYPE = DEFAULT_USER_TYPE & { role: FULL_ROLE_TYPE }
// 用户安全-角色默认 类型
export type USER_SAFE_ROLE_DEFAULT_TYPE = SAFE_USER_TYPE & { role: DEFAULT_ROLE_TYPE }
// 用户安全-角色安全 类型
export type USER_ROLE_SAFE_TYPE = SAFE_USER_TYPE & { role: SAFE_ROLE_TYPE }
// 用户安全-角色完整 类型
export type USER_SAFE_ROLE_FULL_TYPE = SAFE_USER_TYPE & { role: FULL_ROLE_TYPE }
// 用户完整-角色默认 类型
export type USER_FULL_ROLE_DEFAULT_TYPE = FULL_USER_TYPE & { role: DEFAULT_ROLE_TYPE }
// 用户完整-角色安全 类型
export type USER_FULL_ROLE_SAFE_TYPE = FULL_USER_TYPE & { role: SAFE_ROLE_TYPE }
// 用户完整-角色完整 类型
export type USER_ROLE_FULL_TYPE = FULL_USER_TYPE & { role: FULL_ROLE_TYPE }

// 角色默认-权限默认 类型
export type ROLE_DEFAULT_PERMISSION_DEFAULT_TYPE = DEFAULT_ROLE_TYPE & { permission: DEFAULT_PERMISSION_TYPE }
// 角色安全-权限默认 类型
export type ROLE_SAFE_PERMISSION_DEFAULT_TYPE = SAFE_ROLE_TYPE & { permission: DEFAULT_PERMISSION_TYPE }
// 角色完整-权限默认 类型
export type ROLE_FULL_PERMISSION_DEFAULT_TYPE = FULL_ROLE_TYPE & { permission: DEFAULT_PERMISSION_TYPE }
// 角色默认-权限安全 类型
export type ROLE_DEFAULT_PERMISSION_SAFE_TYPE = DEFAULT_ROLE_TYPE & { permission: SAFE_PERMISSION_TYPE }
// 角色安全-权限安全 类型
export type ROLE_SAFE_PERMISSION_SAFE_TYPE = SAFE_ROLE_TYPE & { permission: SAFE_PERMISSION_TYPE }
// 角色完整-权限安全 类型
export type ROLE_FULL_PERMISSION_SAFE_TYPE = FULL_ROLE_TYPE & { permission: SAFE_PERMISSION_TYPE }
// 角色默认-权限完整 类型
export type ROLE_DEFAULT_PERMISSION_FULL_TYPE = DEFAULT_ROLE_TYPE & { permission: FULL_PERMISSION_TYPE }
// 角色安全-权限完整 类型
export type ROLE_SAFE_PERMISSION_FULL_TYPE = SAFE_ROLE_TYPE & { permission: FULL_PERMISSION_TYPE }
// 角色完整-权限完整 类型
export type ROLE_FULL_PERMISSION_FULL_TYPE = FULL_ROLE_TYPE & { permission: FULL_PERMISSION_TYPE }
import  {type Prisma, User} from "@prisma/client";


// 基础类型定义
export type UserSelect =  Prisma.UserSelect
export type UserInclude = Prisma.UserInclude
export type UserFindOptions = {
    select?: UserSelect,
    include?: UserInclude,
}

export type UserWithFields<T extends UserFindOptions> = Prisma.UserGetPayload<{
    select?: T['select'],
    include?: T['include'],
}>

// 默认查询配置
export const DEFAULT_USER = {
    id: true,
    email: true,
    password: true,
    userName: true,
    avatarUrl: true,
    phone: true,
    roleId: true,
    failedLoginAttempts: true,
    lockUntil: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    // [K in keyof Omit<User,'password'>]: true
} satisfies Prisma.UserSelect;

export const FULL_USER_WITHOUT_PWD = {
    id: true,
    email: true,
    userName: true,
    avatarUrl: true,
    phone: true,
    roleId: true,
    failedLoginAttempts: true,
    lockUntil: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
} satisfies Prisma.UserSelect;

export const SAFE_USER={
  id: true,
  userName: true,
  email: true,
  avatarUrl: true,
  phone: true,
} satisfies Prisma.UserSelect;

export const SAFE_USER_WITH_ROLE = {
  select: SAFE_USER,
  include: {
    role: true,
  },
} satisfies UserFindOptions;

// 常量推断
export type SafeUser = UserWithFields<typeof SAFE_USER>;

// 安全用户带角色类型
export type SafeUserWithRole = UserWithFields<typeof SAFE_USER_WITH_ROLE>;

// 完整用户类型
export type FullUser = UserWithFields<typeof FULL_USER_WITHOUT_PWD>;

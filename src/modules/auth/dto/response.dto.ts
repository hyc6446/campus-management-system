import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ItemResSchma } from '@app/common/validators/zod-validators'

export const LoginResSchema = z.object({
  accessToken: z.string().describe('访问令牌'),
  refreshToken: z.string().describe('刷新令牌'),
  user: z
    .object({
      id: z.number().describe('用户ID'),
      email: z.email().describe('邮箱'),
      userName: z.string().describe('用户名'),
      avatarUrl: z.string().nullable().describe('头像URL'),
      phone: z.string().nullable().describe('电话'),
      roleId: z.number().describe('角色ID'),
      createdAt: z.string().describe('创建时间'),
      failedLoginAttempts: z.number().describe('失败登录尝试次数'),
      lockUntil: z.string().nullable().describe('锁定时间'),
      updatedAt: z.string().nullable().describe('更新时间'),
      deletedAt: z.string().nullable().describe('删除时间'),
      role: z
        .object({
          id: z.number().describe('角色ID'),
          name: z.string().describe('角色名称'),
        })
        .describe('角色信息'),
    })
    .describe('用户信息'),
})
export class LoginResDto extends createZodDto(ItemResSchma(LoginResSchema)) {}

export const RegResSchema = z.object({
  id: z.number().describe('用户ID'),
  email: z.email().describe('邮箱'),
  userName: z.string().describe('用户名'),
  avatarUrl: z.string().nullable().describe('头像URL'),
  phone: z.string().nullable().describe('电话'),
  roleId: z.number().describe('角色ID'),
  createdAt: z.string().describe('创建时间'),
  failedLoginAttempts: z.number().describe('失败登录尝试次数'),
  lockUntil: z.string().nullable().describe('锁定时间'),
  updatedAt: z.string().nullable().describe('更新时间'),
  deletedAt: z.string().nullable().describe('删除时间'),
})
export class RegResDto extends createZodDto(ItemResSchma(RegResSchema)) {}

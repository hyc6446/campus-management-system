import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'

const UserItemSchema = z.object({
  id: z.number().describe('用户ID'),
  email: z.string().describe('邮箱'),
  userName: z.string().describe('用户名'),
  avatarUrl: z.string().optional().describe('头像URL'),
  phone: z.string().optional().describe('电话'),
  roleId: z.number().describe('角色ID'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(UserItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(UserItemSchema)) {}



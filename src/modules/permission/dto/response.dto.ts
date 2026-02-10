import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'

const PermissionItemSchema = z.object({
  id: z.number().describe('权限ID'),
  action: z.string().describe('动作'),
  subject: z.string().describe('对象'),
  roleId: z.number().describe('角色ID'),
  createdAt: z.date().describe('创建时间'),
  updatedAt: z.date().describe('更新时间'),
})

export class PermissionsResDto extends createZodDto(ListResSchema(PermissionItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(PermissionItemSchema)) {}



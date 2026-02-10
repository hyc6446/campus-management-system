import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


// 角色列表项
const RoleItemSchema = z.object({
  id: z.number().describe('角色ID'),
  name: z.string().describe('角色名称'),
  createdAt: z.date().describe('创建时间'),
  updatedAt: z.date().describe('更新时间'),
})

export class RolesResDto extends createZodDto(ListResSchema(RoleItemSchema)) {}
export class RoleResDto extends createZodDto(ItemResSchma(RoleItemSchema)) {}



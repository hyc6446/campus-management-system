import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const createSchema = z.object({
  action: z
    .string('操作类型不能为空')
    .transform(val => val.trim().toLowerCase())
    .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
    .describe('动作'),
  subject: z
    .string('操作对象类型不能为空')
    .transform(val => val.trim().toLowerCase())
    .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
    .describe('对象'),
  roleId: z.coerce.number().int('关联角色ID必须是整数').describe('角色ID'),
})

export class CreateDto extends createZodDto(createSchema) {}


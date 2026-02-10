import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const UpdateSchema = z
  .object({
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
  .refine(
    data => {
      // 检查是否没有非空值
      return !Object.values(data).some(value => value !== '')
    },
    { message: '至少一个有效的字段' }
  )

export class UpdateDto extends createZodDto(UpdateSchema) {}

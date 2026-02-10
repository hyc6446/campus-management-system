import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const createSchema = z.object({
  rule: z
    .string('规则名称不能为空')
    .trim()
    .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
    .describe('规则名称'),
  type: z
    .enum(['action', 'subject'], { message: '无效的规则类型' })
    .default('action')
    .transform(val => val?.trim().toLowerCase() || 'action')
    .describe('规则类型,范围:action,subject'),
})

export class CreateDto extends createZodDto(createSchema) {}


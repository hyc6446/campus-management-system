import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const CreateRuleConfigSchema = z.object({
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

// 不需要单独创建 Swagger 类
export class CreateRuleConfigDto extends createZodDto(CreateRuleConfigSchema) {}

// 导出类型供其他地方使用
export type CreateRuleConfigType = z.infer<typeof CreateRuleConfigSchema>

import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { RULE_CONFIG_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

export const UpdateRuleConfigSchema = z
  .object({
    rule: z.string('规则名称不能为空').trim().toLowerCase().optional().describe('规则名称'),
    type: z
      .enum(['action', 'subject'], { message: '无效的规则类型' })
      .default('action')
      .transform((val) => val?.trim().toLowerCase() || 'action')
      .optional()
      .describe('规则类型,范围:action,subject'),
  })
  .refine(
    data => {
      return (data.rule !== undefined && data.rule.trim() !== '') || data.type !== undefined
    },
    { message: '必须提供至少一个有效的字段', path: ['rule', 'type'] }
  )

// 使用 createZodDto 创建 DTO 类
// nestjs-zod V5 会自动处理可选字段和验证逻辑
export class UpdateRuleConfigDto extends createZodDto(UpdateRuleConfigSchema) {}

// 导出类型供其他地方使用
export type UpdateRuleConfigType = z.infer<typeof UpdateRuleConfigSchema>

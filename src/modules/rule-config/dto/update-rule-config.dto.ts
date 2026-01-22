import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

export const UpdateRuleConfigSchema = z
  .object({
    rule: z.string('规则名称不能为空').optional(),
    type: z.enum(['action', 'subject'], '无效的规则类型').optional(),
  })
  .refine(
    data => {
      return (data.rule !== undefined && data.rule.trim() !== '') || data.type !== undefined
    },
    { message: '必须提供至少一个有效的字段', path: ['rule', 'type'] }
  )

export type UpdateRuleConfigDto = z.infer<typeof UpdateRuleConfigSchema>

export class UpdateRuleConfigDtoSwagger {
  @ApiProperty({
    example: 'READ', // 文档中显示的示例值
    description: '规则名称', // 文档中显示的字段描述
    type: String, // 字段类型
    required: true, // 是否为必填字段
  })
  rule?: string = 'READ'
  @ApiProperty({
    example: 'action', // 文档中显示的示例值
    description: '规则类型', // 文档中显示的字段描述
    enum: ['action', 'subject'], // 枚举值
    type: String, // 字段类型
    required: true, // 是否为必填字段
  })
  type?: string = 'action'
}

import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationSchema, sortingSchema } from '@app/common/validators/zod-validators'

export const QueryRuleConfigSchema = z.object({
  ...paginationSchema.shape,
  id: z.coerce.number().int({ message: '规则ID必须为整数' }).optional().describe('规则ID'),
  rule: z.string({ message: '规则名称不能为空' }).optional().describe('规则名称'),
  type: z
    .enum(['action', 'subject'], { message: '无效的规则类型' })
    .default('action')
    .transform((val) => val?.trim().toLowerCase() || 'action')
    .optional()
    .describe('规则类型,范围:action,subject'),
  createdAt: z.string({ message: '创建时间必须为字符串或日期' }).transform((val) => new Date(val)).optional().describe('创建时间'),
  ...sortingSchema.shape,
})

// 使用 createZodDto 创建 DTO 类
export class QueryRuleConfigDto extends createZodDto(QueryRuleConfigSchema) {}

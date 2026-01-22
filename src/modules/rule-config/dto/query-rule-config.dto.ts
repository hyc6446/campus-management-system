import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'

export const QueryRuleConfigSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  // 筛选参数,支持多字段筛选
  id: z.coerce.number().int().optional(),
  rule: z.string('规则名称不能为空'),
  type: z.enum(['action', 'subject'], '无效的规则类型').default('action'),
  createdAt: z.union([z.string(), z.date()]).optional(),
  // 排序方式
  sortBy: z.string().optional().default('createdAt'),
  order: z.string().optional().default('desc'),
})

export type QueryRuleConfigDto = z.infer<typeof QueryRuleConfigSchema>

export class QueryRuleConfigDtoSwagger {
  @ApiProperty({
    example: 1, // 文档中显示的示例值
    description: '页码', // 文档中显示的字段描述
    type: Number, // 字段类型
    required: false, // 是否为必填字段
  })
  page? = 1
  @ApiProperty({
    example: 10, // 文档中显示的示例值
    description: '每页数量', // 文档中显示的字段描述
    type: Number, // 字段类型
    required: false, // 是否为必填字段
  })
  limit? = 10
  @ApiProperty({
    example: 'createdAt', // 文档中显示的示例值
    description: '排序字段', // 文档中显示的字段描述
    type: String, // 字段类型
    required: false, // 是否为必填字段
  })
  sortBy? = 'createdAt'
  @ApiProperty({
    example: 'desc', // 文档中显示的示例值
    description: '排序方向', // 文档中显示的字段描述
    type: String, // 字段类型
    required: false, // 是否为必填字段
  })
  order? = 'desc'
  @ApiProperty({
    example: 1, // 文档中显示的示例值
    description: '规则配置ID', // 文档中显示的字段描述
    type: Number, // 字段类型
    required: false, // 是否为必填字段
  })
  id? = 1
  @ApiProperty({
    example: 'READ', // 文档中显示的示例值
    description: '规则名称', // 文档中显示的字段描述
    type: String, // 字段类型
    required: false, // 是否为必填字段
  })
  rule? = 'READ'
  @ApiProperty({
    example: 'action', // 文档中显示的示例值
    description: '规则类型', // 文档中显示的字段描述
    enum: ['action', 'subject'], // 枚举值
    type: String, // 字段类型
    required: false, // 是否为必填字段
  })
  type? = 'action'
  @ApiProperty({
    example: '2023-01-01', // 文档中显示的示例值
    description: '创建时间', // 文档中显示的字段描述
    type: String, // 字段类型
    required: false, // 是否为必填字段
  })
  createdAt? = '2023-01-01'
}

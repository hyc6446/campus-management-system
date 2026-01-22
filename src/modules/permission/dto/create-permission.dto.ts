import { ApiProperty } from '@nestjs/swagger'
import { z } from 'zod'
import { CaslConditionValue } from '@common/types/permission.type'

// CASL条件语法的递归校验规则
const caslConditionSchema: z.ZodType<CaslConditionValue> = z.lazy(() =>
  z.union([
    // 基础值类型
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    // 数组类型
    z.array(caslConditionSchema),
    // 对象类型 - 支持CASL的MongoDB-like查询语法
    z.record(
      z.string(),
      z.union([
        // 直接值比较
        caslConditionSchema,
        // 操作符比较 { field: { $eq: value } }
        z.object({
            // 支持的CASL操作符
            $eq: caslConditionSchema.optional(),
            $ne: caslConditionSchema.optional(),
            $gt: caslConditionSchema.optional(),
            $gte: caslConditionSchema.optional(),
            $lt: caslConditionSchema.optional(),
            $lte: caslConditionSchema.optional(),
            $in: z.array(caslConditionSchema).optional(),
            $nin: z.array(caslConditionSchema).optional(),
            $contains: caslConditionSchema.optional(),
            $startsWith: caslConditionSchema.optional(),
            $endsWith: caslConditionSchema.optional(),
          })
          .refine(obj => Object.keys(obj).length > 0, '必须提供至少一个操作符'),
      ])
    )
  ])
)

export const CreatePermissionSchema = z.object({
  action: z.string('操作类型不能为空').transform(val => val.trim().toUpperCase()),
  subject: z.string('操作对象类型不能为空').transform(val => val.trim().toUpperCase()),
  // 操作条件字段：可选，必须是有效的CASL条件对象
  conditions: caslConditionSchema.optional(),
  roleId: z.coerce.number().int('关联角色ID必须是整数'),
  createdAt: z.union([z.string(), z.date()]).optional(),
})

export type CreatePermissionDto = z.infer<typeof CreatePermissionSchema>

export class CreatePermissionDtoSwagger {
  // 操作类型字段的Swagger文档配置
  @ApiProperty({
    example: 'create', // 文档中显示的示例值
    description: '操作类型', // 文档中显示的字段描述
    type: String, // 字段类型
    required: true, // 是否为必填字段
  })
  action!: string
  // 操作对象类型字段的Swagger文档配置
  @ApiProperty({
    example: 'user', // 文档中显示的示例值
    description: '操作对象类型', // 文档中显示的字段描述
    type: String, // 字段类型
    required: true, // 是否为必填字段
  })
  subject!: string
  // 操作条件字段的Swagger文档配置
  @ApiProperty({
    example: '{"name": "Admin"}', // 文档中显示的示例值
    description: '操作条件', // 文档中显示的字段描述
    type: Object, // 字段类型
    required: false, // 是否为必填字段
  })
  conditions!: CaslConditionValue | null
  // 操作时间字段的Swagger文档配置
  @ApiProperty({
    example: '2023-01-01', // 文档中显示的示例值
    description: '操作时间', // 文档中显示的字段描述
    type: String, // 字段类型
    required: false, // 是否为必填字段
  })
  createdAt!: Date
}

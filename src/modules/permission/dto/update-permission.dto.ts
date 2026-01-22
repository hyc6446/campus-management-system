// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger'
import { CaslConditionValue } from '@common/types/permission.type'
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod'

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
        z
          .object({
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
    ),
  ])
)

export const UpdatePermissionSchema = z.object({
  action: z.string().min(1, '操作类型不能为空'),
  subject: z.string().min(1, '操作资源类型不能为空'),
  conditions: caslConditionSchema.optional(),
  roleId: z.number().min(1, '角色ID不能为空'),
})

export type UpdatePermissionDto = z.infer<typeof UpdatePermissionSchema>

export class UpdatePermissionDtoSwagger {
  // 权限ID字段的Swagger文档配置
  @ApiProperty({
    example: 123456, // 文档中显示的示例值
    description: '权限ID', // 文档中显示的字段描述
    type: Number, // 字段类型
    required: true, // 是否为必填字段
  })
  id!: number
  // 操作字段的Swagger文档配置
  @ApiProperty({
    example: 'create', // 文档中显示的示例值
    description: '操作类型', // 文档中显示的字段描述
    type: String, // 字段类型
    required: true, // 是否为必填字段
  })
  action: string = ''
  // 资源字段的Swagger文档配置
  @ApiProperty({
    example: 'user', // 文档中显示的示例值
    description: '操作条件类型', // 文档中显示的字段描述
    type: String, // 字段类型
    required: true, // 是否为必填字段
  })
  subject: string = ''
  // 资源ID字段的Swagger文档配置
  @ApiProperty({
    example: '123456', // 文档中显示的示例值
    description: '操作条件', // 文档中显示的字段描述
    type: Object, // 字段类型
    required: true, // 是否为必填字段
  })
  conditions?: CaslConditionValue | null = null
  // 操作详情字段的Swagger文档配置
  @ApiProperty({
    example: 123456, // 文档中显示的示例值
    description: '关联角色ID', // 文档中显示的字段描述
    type: Number, // 字段类型
    required: true, // 是否为必填字段
  })
  roleId!: number
  // 操作详情字段的Swagger文档配置
  @ApiProperty({
    example: new Date(), // 文档中显示的示例值
    description: '操作更新时间', // 文档中显示的字段描述
    type: Date, // 字段类型
    required: true, // 是否为必填字段
  })
  updatedAt: Date = new Date()
  // 启用状态字段的Swagger文档配置
  @ApiProperty({
    example: true, // 文档中显示的示例值
    description: '启用状态', // 文档中显示的字段描述
    type: Boolean, // 字段类型
    required: false, // 是否为必填字段
  })
  isEnabled?: boolean | null = true
}

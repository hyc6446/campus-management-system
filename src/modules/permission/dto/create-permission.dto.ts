import { z } from 'zod'
import { createZodDto } from 'nestjs-zod';
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
  action: z.string('操作类型不能为空').transform(val => val.trim().toUpperCase()).describe('动作'),
  subject: z.string('操作对象类型不能为空').transform(val => val.trim().toUpperCase()).describe('对象'),
  conditions: caslConditionSchema.optional().describe('条件'),
  roleId: z.coerce.number().int('关联角色ID必须是整数').describe('角色ID'),
  createdAt: z.union([z.string(), z.date()]).optional().describe('创建时间'),
})



export class CreatePermissionDto extends createZodDto(CreatePermissionSchema) {}

// 导出类型供其他地方使用
export type CreatePermissionType = z.infer<typeof CreatePermissionSchema>
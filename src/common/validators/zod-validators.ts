import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

// 公用Schema配置项
export const paginationSchema = z.object({
  page: z.coerce
    .number('页码必须为数字')
    .int('页码必须为整数')
    .min(1, '页码必须大于等于1')
    .transform(val => Math.max(1, Math.min(100, val)))
    .optional()
    .default(1)
    .describe('页码'),
  limit: z.coerce
    .number('每页数量必须为数字')
    .int('每页数量必须为整数')
    .min(1, '每页数量必须大于等于1')
    .max(100, '每页数量最多100条')
    .transform(val => Math.max(1, Math.min(100, val)))
    .optional()
    .default(10)
    .describe('每页数量'),
})

// 排序字段验证函数
export function validateSortFields(data: any, allowedSortFields: string[] = ['createdAt']) {
  const sortStr = data.sortBy?.trim().toLowerCase() || 'createdAt'
  const orderStr = data.order?.trim().toLowerCase() || 'desc'
  const sortBy: string = allowedSortFields.includes(sortStr) ? sortStr : 'createdAt'
  const order: string = ['asc', 'desc'].includes(orderStr) ? orderStr : 'desc'
  return { ...data, sortBy, order }
}
// 通用排序字段 Schema 生成函数
export function createSortingSchema(allowedFields: string[]) {
  return z
    .object({
      sortBy: z
        .enum(allowedFields as [string, ...string[]])
        .default('createdAt')
        .optional()
        .describe('排序字段'),
      order: z.enum(['asc', 'desc']).default('desc').optional().describe('排序方式'),
    })
    .refine(val => validateSortFields(val, allowedFields), {
      message: `无效的排序字段`,
    })
}

// 通用成功响应 Schema 生成函数
export function ItemResSchma(data: any) {
  return z.object({
    code: z.number().int().default(200),
    success: z.boolean().default(true),
    message: z.string().default('操作成功'),
    data: z.record(z.string(), z.any()).default(data || {} || null),
    timestamp: z.string().default(() => new Date().toISOString()),
  })
}

export function ListResSchema(data: any) {
  return z.object({
    code: z.number().int().default(200).describe('状态码'),
    success: z.boolean().default(true).describe('是否成功'),
    message: z.string().default('操作成功').describe('操作结果描述'),
    data: z
      .object({
        data: z.array(data).describe('角色信息列表'),
        total: z.number().describe('总数量'),
        page: z.number().describe('当前页码'),
        pageSize: z.number().describe('每页数量'),
        hasNextPage: z.boolean().describe('是否有下一页'),
      })
      .describe('分页数据'),
    timestamp: z
      .string()
      .default(() => new Date().toISOString())
      .describe('响应时间'),
  })
}

// export const OkResponseDto = createZodDto(OkResponseSchema({}))

// 通用错误响应 Schema 生成函数
export const errorResponseSchema = z.object({
  statusCode: z.number().int().default(500),
  errorCode: z.string().default('INTERNAL_SERVER_ERROR'),
  message: z.string().default('Internal server error'),
  details: z.record(z.string(), z.any()).default({}).optional(),
  timestamp: z.string().default(() => new Date().toISOString()),
  path: z.string().default(''),
})

// 创建ErrorResponseDto类
export class ErrResDto extends createZodDto(errorResponseSchema) {}

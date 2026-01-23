import { z } from 'zod'

// 公用Schema配置项
export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int({ message: '页码必须为整数' })
    .min(1, { message: '页码必须大于等于1' })
    .default(1)
    .transform((val) => Math.max(1, Math.min(100, val)))
    .optional()
    .describe('页码'),
  limit: z.coerce
    .number()
    .int({ message: '每页数量必须为整数' })
    .min(1, { message: '每页数量必须大于等于1' })
    .max(100, { message: '每页数量最多100条' })
    .default(10)
    .transform((val) => Math.max(1, Math.min(100, val)))
    .optional()
    .describe('每页数量'),
})

export const sortingSchema = z.object({
  sortBy: z
    .string({ message: '排序字段必须为字符串' })
    .transform((val) => val?.trim() || 'createdAt')
    .default('createdAt')
    .optional()
    .describe('排序字段'),
  order: z
    .string({ message: '排序方式必须为字符串' })
    .transform((val) => val?.trim() || 'desc')
    .default('desc')
    .optional()
    .describe('排序方式'),
})

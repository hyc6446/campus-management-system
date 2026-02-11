import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1).describe('页码'),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10).describe('每页数量'),
  sortBy: z.enum(['id', 'isbn', 'name', 'createdAt', 'publicationYear']).optional().default('createdAt').describe('排序字段'),
  order: z.enum(['asc', 'desc']).optional().default('desc').describe('排序方式'),
  id: z.coerce.number().int().min(1).optional().describe('图书ID'),
  name: z.string().trim().optional().describe('图书名称'),
  isbn: z.string().trim().optional().describe('ISBN'),
  author: z.string().trim().optional().describe('作者'),
  publicationYear: z.coerce.number().int().min(1900).optional().describe('出版年份'),
  createdAt: z.string().datetime().optional().describe('创建时间'),
})

export class QueryDto extends createZodDto(querySchema) {}
export type QueryType = z.infer<typeof querySchema>

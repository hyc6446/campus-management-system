import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { BOOK_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.int('ID必须为整数').optional().describe('ID'),
    isbn: z.string('ISBN号不可为空').trim().optional().describe('ISBN号'),
    name: z.string('书名不可为空').trim().optional().describe('书名'),
    author: z.string('作者不可为空').trim().optional().describe('作者'),
    publicationYear: z.number('出版年份必须为整数').int('出版年份必须为整数').optional().describe('出版年份'),
    createdAt: z
      .string()
      .trim()
      .transform(val => new Date(val))
      .optional()
      .describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(BOOK_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}
export type QueryType = z.infer<typeof querySchema>

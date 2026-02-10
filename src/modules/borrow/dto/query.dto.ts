import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { BORROW_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'
import { BorrowStatus } from '@prisma/client'

const querySchema = z
  .object({
    id: z.int('ID必须为整数').optional().describe('ID'),
    bookId: z.int('书籍ID必须为整数').optional().describe('书籍ID'),
    userId: z.int('用户ID必须为整数').optional().describe('用户ID'),
    status: z.enum(BorrowStatus).default(BorrowStatus.PENDING).optional().describe('状态'),
    createdAt: z
      .string()
      .trim()
      .transform(val => new Date(val))
      .optional()
      .describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(BORROW_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}
export type QueryType = z.infer<typeof querySchema>

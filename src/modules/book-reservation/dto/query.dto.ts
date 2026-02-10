import z from 'zod'
import { createZodDto } from 'nestjs-zod'
import { ReservationStatus } from '@prisma/client'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { BOOK_RESERVATION_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.int('').optional().describe('ID'),
    bookId: z.int('').optional().describe('书籍ID'),
    userId: z.int('').optional().describe('用户ID'),
    status: z.enum(ReservationStatus).optional().describe('状态'),
    createdAt: z
      .string()
      .trim()
      .transform(val => new Date(val))
      .optional()
      .describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(BOOK_RESERVATION_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}
export type QueryType = z.infer<typeof querySchema>

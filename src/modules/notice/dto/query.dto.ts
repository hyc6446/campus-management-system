import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { SYSTEM_NOTICE_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.int('').optional().describe('ID'),
    title: z.string('').trim().optional().describe('通知标题'),
    createdAt: z
      .string()
      .transform(val => new Date(val))
      .optional()
      .describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(SYSTEM_NOTICE_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}

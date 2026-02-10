import z from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { COURSE_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.int('').optional().describe('ID'),
    name: z.string('').trim().optional().describe('课程名称'),
    createdAt:z.string().transform(val => new Date(val)).optional().describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(COURSE_ALLOWED_SORT_FIELDS).shape);

export class QueryDto extends createZodDto(querySchema) {};

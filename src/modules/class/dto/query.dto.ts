import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { CLASS_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.int('ID必须为整数').optional().describe('ID'),
    name: z.string('').trim().optional().describe('班级名称'),
    createdAt:z.string().transform(val => new Date(val)).optional().describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(CLASS_ALLOWED_SORT_FIELDS).shape);

export class QueryDto extends createZodDto(querySchema) {};
export type QueryType = z.infer<typeof querySchema>;

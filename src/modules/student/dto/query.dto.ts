import z from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { STUDENT_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.int('').optional().describe('ID'),
    name: z.string('').trim().optional().describe('学生名称'),  
    classId: z.number('').int('班级ID必须为整数').optional().describe('班级ID'),
    createdAt:z.string().transform(val => new Date(val)).optional().describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(STUDENT_ALLOWED_SORT_FIELDS).shape);

export class QueryDto extends createZodDto(querySchema) {};

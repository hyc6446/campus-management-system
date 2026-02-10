import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { COURSE_ENROLLMENT_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'
import { EnrollmentStatus } from '@prisma/client'

const querySchema = z
  .object({
    id: z.int('').optional().describe('ID'),
    courseId: z.number('').int('课程ID必须为整数').optional().describe('课程ID'),
    userId: z.number('').int('用户ID必须为整数').optional().describe('用户ID'),
    teachingId: z.number('').int('教师ID必须为整数').optional().describe('教师ID'),
    status: z.enum(EnrollmentStatus).optional().describe('状态'),
    createdAt: z
      .string()
      .trim()
      .transform(val => new Date(val))
      .optional()
      .describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(COURSE_ENROLLMENT_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}

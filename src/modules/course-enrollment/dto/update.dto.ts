import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z
  .object({
    courseId: z.number('').int('课程ID必须为整数').optional().describe('课程ID'),
    userId: z.number('').int('用户ID必须为整数').optional().describe('用户ID'),
    teachingId: z.number('').int('教师ID必须为整数').optional().describe('教师ID'),
  })
  .refine(data => !Object.values(data).some(value => value !== undefined), {
    message: '至少有一项更新信息',
  })

export class UpdateDto extends createZodDto(updateSchema) {}

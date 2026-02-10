import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const createSchema = z.object({
  courseId: z.number('课程ID不能为空').int('课程ID必须为整数').describe('课程ID'),
  userId: z.number('用户ID不能为空').int('用户ID必须为整数').describe('用户ID'),
  teachingId: z.number('授课ID不能为空').int('授课ID必须为整数').describe('授课ID'),
})


export class CreateDto extends createZodDto(createSchema) {}

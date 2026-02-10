import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z
  .object({
    name: z.string('').optional().describe('课程名称'),
    credit: z.number('').optional().describe('课程学分'),
    description: z.string('').optional().describe('课程描述'),
  })
  .refine(data => !Object.values(data).some(value => value !== ''), {
    message: '至少有一项更新信息',
  })

export class UpdateDto extends createZodDto(updateSchema) {}

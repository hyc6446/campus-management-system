import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const createSchema = z.object({
  name: z.string('课程名称不能为空').describe('课程名称'),
  credit: z.number('课程学分不能为空').describe('课程学分'),
  description: z.string('课程描述不能为空').optional().describe('课程描述'),
})


export class CreateDto extends createZodDto(createSchema) {}

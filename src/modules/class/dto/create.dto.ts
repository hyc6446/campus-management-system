import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const createSchema = z.object({
  name: z.string('班级名称不能为空').describe('班级名称'),
  description: z.string('班级描述不能为空').optional().describe('班级描述'),
})


export class CreateDto extends createZodDto(createSchema) {}
export type CreateType = z.infer<typeof createSchema>

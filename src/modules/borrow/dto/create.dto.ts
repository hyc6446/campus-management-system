import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const createSchema = z.object({
  bookId: z.number('书籍ID不能为空').int('书籍ID必须为整数').describe('书籍ID'),
  userId: z.number('用户ID不能为空').int('用户ID必须为整数').describe('用户ID'),
  borrowTime: z
    .string()
    .trim()
    .transform(str => new Date(str))
    .optional()
    .describe('借阅时间'),
  dueDate: z
    .string()
    .trim()
    .transform(str => new Date(str))
    .optional()
    .describe('到期时间'),
})

export class CreateDto extends createZodDto(createSchema) {}
export type CreateType = z.infer<typeof createSchema>

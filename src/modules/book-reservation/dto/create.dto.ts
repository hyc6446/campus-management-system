import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const createSchema = z.object({
  bookId: z.number('预定书籍不能为空').int('书籍ID必须为整数').describe('书籍ID'),
  userId: z.number('预定人不能为空').int('用户ID必须为整数').describe('预定人ID'),
  reserveTime: z
    .string()
    .trim()
    .transform(str => new Date(str))
    .optional()
    .describe('预定时间'),
  expireTime: z
    .string()
    .trim()
    .transform(str => new Date(str))
    .optional()
    .describe('过期时间'),
})

export class CreateDto extends createZodDto(createSchema) {}
export type CreateType = z.infer<typeof createSchema>

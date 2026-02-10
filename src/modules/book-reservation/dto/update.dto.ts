import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z
  .object({
    bookId: z.number('').int('书籍ID必须为整数').describe('书籍ID'),
    userId: z.number('').int('用户ID必须为整数').describe('预定人ID'),
    reserveTime: z.string().trim().transform(str => new Date(str)).describe('预定时间'),
    expireTime: z.string().trim().transform(str => new Date(str)).describe('过期时间'),
  })
  .refine(data => !Object.values(data).some(value => value !== undefined), {
    message: '至少有一项更新信息',
  })

export class UpdateDto extends createZodDto(updateSchema) {}
export type UpdateType = z.infer<typeof updateSchema>

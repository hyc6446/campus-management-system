import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z
  .object({
    bookId: z.number('').int('书籍ID必须为整数').optional().describe('书籍ID'),
    userId: z.number('').int('用户ID必须为整数').optional().describe('用户ID'),
    borrowTime: z.string().trim().transform(date => new Date(date)).optional().describe('借阅时间'),
    dueDate: z.string().trim().transform(date => new Date(date)).optional().describe('到期时间'),
    returnDate: z.string().trim().transform(date => new Date(date)).optional().describe('归还时间'),
  })
  .refine(data => !Object.values(data).some(value => value !== undefined), {
    message: '至少有一项更新信息',
  })

export class UpdateDto extends createZodDto(updateSchema) {}
export type UpdateType = z.infer<typeof updateSchema>

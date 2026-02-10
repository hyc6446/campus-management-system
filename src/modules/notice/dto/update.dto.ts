import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z
  .object({
    title: z.string('').optional().describe('通知标题'),
    content: z.string('').optional().describe('通知内容'),
    expireAt: z
      .string()
      .trim()
      .transform(val => new Date(val))
      .optional()
      .describe('过期时间'),
  })
  .refine(data => !Object.values(data).some(value => value !== ''), {
    message: '至少有一项更新信息',
  })

export class UpdateDto extends createZodDto(updateSchema) {}  

import { createZodDto } from 'nestjs-zod'
import { NoticeType } from '@prisma/client'
import z from 'zod'

const createSchema = z.object({
  title: z.string('通知标题不能为空').describe('通知标题'),
  content: z.string('通知内容不能为空').describe('通知内容'),
  expireAt: z
    .string()
    .trim()
    .transform(val => new Date(val))
    .optional()
    .describe('过期时间'),
})

export class CreateDto extends createZodDto(createSchema) {}

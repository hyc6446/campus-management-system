import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { NoticeType } from '@prisma/client'

import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'

const NoticeItemSchema = z.object({
  id: z.number().describe('通知ID'),
  type: z.enum(NoticeType).default(NoticeType.ANNOUNCEMENT).describe('通知类型'),
  publisherId: z.number().int().describe('发布者ID'),
  title: z.string().describe('通知标题'),
  content: z.string().describe('通知内容'),
  expireAt: z.string().optional().describe('过期时间'),
  createdAt: z.string().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(NoticeItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(NoticeItemSchema)) {}



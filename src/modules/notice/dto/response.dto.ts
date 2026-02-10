import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'

const NoticeItemSchema = z.object({
  id: z.number().describe('通知ID'),
  title: z.string().describe('通知标题'),
  content: z.string().describe('通知内容'),
  createdAt: z.date().describe('创建时间'),
  updatedAt: z.date().describe('更新时间'),
})

export class NoticesResDto extends createZodDto(ListResSchema(NoticeItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(NoticeItemSchema)) {}



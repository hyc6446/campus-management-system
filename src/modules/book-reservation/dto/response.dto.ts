import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


const BookReservationItemSchema = z.object({
  id: z.number().describe('预约ID'),
  bookId: z.number().describe('图书ID'),
  userId: z.number().describe('用户ID'),
  status: z.string().describe('预约状态'),
  reserveTime: z.date().describe('预约时间'),
  expireTime: z.date().describe('过期时间'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(BookReservationItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(BookReservationItemSchema)) {}

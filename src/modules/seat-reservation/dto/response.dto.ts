import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


// 座位预约列表项
const SeatReserveItemSchema = z.object({
  id: z.number().describe('预约ID'),
  seatId: z.number().describe('座位ID'),
  userId: z.number().describe('用户ID'),
  status: z.string().describe('状态'),
  reserveDate: z.date().describe('预约日期'),
  startTime: z.date().describe('开始时间'),
  endTime: z.date().describe('结束时间'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(SeatReserveItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(SeatReserveItemSchema)) {}



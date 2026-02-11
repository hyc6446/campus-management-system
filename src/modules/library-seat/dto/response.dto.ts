import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


const LibrarySeatItemSchema = z.object({ 
  id: z.number().describe('座位ID'),
  seatNumber: z.string().describe('座位号'),
  location: z.string().describe('位置'),
  status: z.string().describe('状态'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(LibrarySeatItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(LibrarySeatItemSchema)) {}

import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


const BorrowItemSchema = z.object({ 
  id: z.number().describe('借阅ID'),
  bookId: z.number().describe('图书ID'),
  userId: z.number().describe('用户ID'),
  status: z.string().describe('借阅状态'),
  borrowDate: z.date().describe('借阅日期'),
  dueDate: z.date().describe('到期日期'),
  returnDate: z.date().describe('归还日期'),
  createdAt: z.date().describe('创建时间'),
  updatedAt: z.date().describe('更新时间'),
})

export class BorrowResDto extends createZodDto(ListResSchema(BorrowItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(BorrowItemSchema)) {}

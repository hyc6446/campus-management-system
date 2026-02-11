import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


// Token列表项
const TokenItemSchema = z.object({
  id: z.number().describe('Token ID'),
  userId: z.number().describe('用户ID'),
  type: z.string().describe('Token类型'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(TokenItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(TokenItemSchema)) {}



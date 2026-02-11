import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


const ClassItemSchema = z.object({ 
  id: z.number().describe('班级ID'),
  name: z.string().describe('班级名称'),
  description: z.string().describe('班级描述'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(ClassItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(ClassItemSchema)) {}

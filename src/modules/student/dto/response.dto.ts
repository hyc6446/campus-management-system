import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


// 学生列表项
const StudentItemSchema = z.object({
  id: z.number().describe('学生ID'),
  name: z.string().describe('学生名称'),
  phone: z.string().describe('学生手机号'),
  cardId: z.string().describe('学生学号/身份证号'),
  classId: z.number().describe('班级ID'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(StudentItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(StudentItemSchema)) {}



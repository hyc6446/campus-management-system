import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


// 学生列表项
const StudentItemSchema = z.object({
  id: z.number().describe('学生ID'),
  name: z.string().describe('学生名称'),
  classId: z.number().describe('班级ID'),
  createdAt: z.date().describe('创建时间'),
  updatedAt: z.date().describe('更新时间'),
})

export class StudentsResDto extends createZodDto(ListResSchema(StudentItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(StudentItemSchema)) {}



import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


const CourseEnrollmentItemSchema = z.object({ 
  id: z.number().describe('课程订阅ID'),
  courseId: z.number().describe('课程ID'),
  userId: z.number().describe('用户ID'),
  teachingId: z.number().describe('教学ID'),
  status: z.string().describe('订阅状态'),
  createdAt: z.date().describe('创建时间'),
  updatedAt: z.date().describe('更新时间'),
})

export class EnrollmentResDto extends createZodDto(ListResSchema(CourseEnrollmentItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(CourseEnrollmentItemSchema)) {}

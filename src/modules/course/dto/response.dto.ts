import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { ListResSchema, ItemResSchma } from '@app/common/validators/zod-validators'


const CourseItemSchema = z.object({ 
  id: z.number().describe('课程ID'),
  name: z.string().describe('课程名称'),
  credit: z.number().describe('学分'),
  description: z.string().describe('课程描述'),
  createdAt: z.date().describe('创建时间'),
})

export class ListResDto extends createZodDto(ListResSchema(CourseItemSchema)) {}
export class ResponseDto extends createZodDto(ItemResSchma(CourseItemSchema)) {}

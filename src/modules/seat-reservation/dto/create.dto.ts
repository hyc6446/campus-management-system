import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const createSchema = z.object({
  seatId: z.number('座位ID不能为空').int('座位ID必须为整数').describe('座位ID'),
  userId: z.number('用户ID不能为空').int('用户ID必须为整数').describe('用户ID'),
  reserveDate: z.string('预约日期不能为空').transform((val) => new Date(val)).describe('预约日期'),
  startTime: z.string('开始时间不能为空').describe('开始时间'),
  endTime: z.string('结束时间不能为空').describe('结束时间'),
})


export class CreateDto extends createZodDto(createSchema) {}

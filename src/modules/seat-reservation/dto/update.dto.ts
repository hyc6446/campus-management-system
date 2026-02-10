import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z
  .object({
    seatId: z.number('').int('座位ID必须为整数').optional().describe('座位ID'),
    userId: z.number('').int('用户ID必须为整数').optional().describe('用户ID'),
    reserveDate: z
      .string('')
      .transform(val => new Date(val))
      .optional()
      .describe('预约日期'),
    startTime: z.string('').optional().describe('开始时间'),
    endTime: z.string('').optional().describe('结束时间'),
  })
  .refine(data => !Object.values(data).some(value => value !== ''), {
    message: '至少有一项更新信息',
  })

export class UpdateDto extends createZodDto(updateSchema) {}

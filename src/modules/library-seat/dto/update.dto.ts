import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const updateSchema = z
  .object({
    seatNumber: z.string('').optional().describe('座位号'),
    location: z.string('').optional().describe('座位位置'),
  })
  .refine(data => !Object.values(data).some(value => value !== ''), {
    message: '至少有一项更新信息',
  })

export class UpdateDto extends createZodDto(updateSchema) {}

import { createZodDto } from 'nestjs-zod'
import z from 'zod'

const createSchema = z.object({
  seatNumber: z.string('座位号不能为空').describe('座位号'),
  location: z.string('座位位置不能为空').describe('座位位置'),
  })


export class CreateDto extends createZodDto(createSchema) {}

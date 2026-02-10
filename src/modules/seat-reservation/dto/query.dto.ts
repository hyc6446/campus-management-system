import { createZodDto } from 'nestjs-zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { SEAT_RESERVATION_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'
import { ReservationStatus } from '@prisma/client'
import z from 'zod'

const querySchema = z
  .object({
    id: z.int('').optional().describe('ID'),
    seatId: z.number('').int('座位ID必须为整数').optional().describe('座位ID'),
    userId: z.number('').int('用户ID必须为整数').optional().describe('用户ID'),
    status: z.enum(ReservationStatus).optional().describe('预约状态'),
    createdAt: z
      .string()
      .transform(val => new Date(val))
      .optional()
      .describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(SEAT_RESERVATION_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}

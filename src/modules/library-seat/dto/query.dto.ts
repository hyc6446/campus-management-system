import { createZodDto } from 'nestjs-zod'
import z from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { LIBRARY_SEAT_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'
import { SeatStatus } from '@prisma/client'

const querySchema = z  
  .object({
    id: z.int('').optional().describe('ID'),
    seatNumber: z.string('').optional().describe('座位号'),
    status: z.enum(SeatStatus).optional().describe('座位状态'),
    createdAt:z.string().transform(val => new Date(val)).optional().describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(LIBRARY_SEAT_ALLOWED_SORT_FIELDS).shape);

export class QueryDto extends createZodDto(querySchema) {};

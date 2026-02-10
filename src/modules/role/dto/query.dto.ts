import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { ROLE_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.coerce.number().int().optional().describe('角色ID'),
    name: z.string().optional().describe('角色名称'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(ROLE_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}

import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { PERMISSION_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.coerce.number().int('权限ID必须是整数').optional().describe('权限ID'),
    action: z
      .string()
      .transform(val => val.trim().toLowerCase())
      .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
      .optional()
      .describe('动作'),
    subject: z
      .string()
      .transform(val => val.trim().toLowerCase())
      .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
      .optional()
      .describe('对象'),
    roleId: z.coerce.number().int('角色ID必须是整数').optional().describe('角色ID'),
    createdAt: z
      .string()
      .trim()
      .optional()
      .transform(val => (val ? new Date(val) : undefined))
      .describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(PERMISSION_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}

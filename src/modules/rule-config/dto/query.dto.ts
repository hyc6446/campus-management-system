import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { RULE_CONFIG_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.coerce.number().int('规则配置ID必须是整数').optional().describe('规则配置ID'),
    rule: z
      .string()
      .trim()
      .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
      .optional()
      .describe('规则名称'),
    type: z
      .enum(['action', 'subject'])
      .default('action')
      .transform(val => val?.trim().toLowerCase() || 'action')
      .optional()
      .describe('规则类型,范围:action,subject'),
    createdAt: z.string().transform(val => new Date(val)).optional().describe('创建时间'),

  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(RULE_CONFIG_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}

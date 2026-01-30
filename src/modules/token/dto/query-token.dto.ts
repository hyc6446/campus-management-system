import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { TokenType } from '@prisma/client'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { TOKEN_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

export const QueryTokenSchema = z
  .object({
    id: z.number().int('令牌ID必须是整数').optional().describe('令牌ID'),
    userId: z.number().int('用户ID必须是整数').optional().describe('用户ID'),
    type: z.enum(TokenType, '必须是有效的令牌类型').optional().describe('令牌类型'),
    deletedAt: z
      .boolean()
      .default(false)
      .optional()
      .describe('激活状态'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(TOKEN_ALLOWED_SORT_FIELDS).shape)

export type QueryTokenType = z.infer<typeof QueryTokenSchema>
export class QueryTokenDto extends createZodDto(QueryTokenSchema) {}
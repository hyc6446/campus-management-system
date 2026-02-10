import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { USER_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types'

const querySchema = z
  .object({
    id: z.number().int('用户ID必须是整数').optional().describe('用户ID'),
    email: z.email('请输入有效的邮箱').optional().describe('用户邮箱'),
    userName: z.string().min(2, '用户名至少2个字符').optional().describe('用户姓名'),
    phone: z.string().optional().describe('用户手机号'),
    roleId: z.number().int('').optional().describe('角色'),
    createdAt: z
      .string()
      .transform(val => new Date(val))
      .optional()
      .describe('创建时间'),
  })
  .extend(paginationSchema.shape)
  .extend(createSortingSchema(USER_ALLOWED_SORT_FIELDS).shape)

export class QueryDto extends createZodDto(querySchema) {}

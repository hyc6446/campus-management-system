import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const CreatePermissionSchema = z.object({
  action: z
    .string('操作类型不能为空')
    .transform(val => val.trim().toLowerCase())
    .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
    .describe('动作'),
  subject: z
    .string('操作对象类型不能为空')
    .transform(val => val.trim().toLowerCase())
    .transform(val => val.charAt(0).toUpperCase() + val.slice(1))
    .describe('对象'),
  roleId: z.coerce.number().int('关联角色ID必须是整数').describe('角色ID'),
  createdAt: z.string().transform(val => new Date(val)).optional().describe('创建时间'),
})

export class CreatePermissionDto extends createZodDto(CreatePermissionSchema) {}

// 导出类型供其他地方使用
export type CreatePermissionType = z.infer<typeof CreatePermissionSchema>

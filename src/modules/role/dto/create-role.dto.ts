import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const CreateRoleSchema = z.object({
  // 角色名称字段：必须是字符串且至少包含1个字符
  name: z
    .string('角色名称不能为空')
    .min(2, '角色名称不能少于2个字符')
    .trim()
    .toUpperCase()
    .describe('角色名称'),
})

export type CreateRoleType = z.infer<typeof CreateRoleSchema>

export class CreateRoleDto extends createZodDto(CreateRoleSchema) {}

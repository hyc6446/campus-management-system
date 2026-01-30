import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const CreateUserSchema = z.object({
  email: z.email('必须是有效的邮箱地址').describe('用户邮箱'),
  password: z.string('密码不能为空').min(8, '密码至少8个字符').describe('用户密码'),
  userName: z.string('姓名不能为空').min(2, '名字至少2个字符').describe('用户姓名'),
  roleId: z.coerce.number().int('角色不能为空').describe('用户角色'),
  // classIds: z.array(z.coerce.number()).optional(),
  // childrenIds: z.array(z.coerce.number()).optional(),
})

export type CreateUserType = z.infer<typeof CreateUserSchema>
export class CreateUserDto extends createZodDto(CreateUserSchema) {}

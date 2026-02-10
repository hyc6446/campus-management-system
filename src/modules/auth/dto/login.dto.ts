import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'
export const LoginSchema = z.object({
  email: z.email('必须是有效的邮箱地址').default('teacher@campus.com').describe('邮箱'),
  password: z
    .string('密码不可为空')
    .min(6, '密码至少6个字符')
    .trim()
    .default('teacher123')
    .describe('密码'),
})


// 使用createZodDto创建响应结构体
export class LoginDto extends createZodDto(LoginSchema) {}
export type LoginSchemaType = z.infer<typeof LoginSchema>


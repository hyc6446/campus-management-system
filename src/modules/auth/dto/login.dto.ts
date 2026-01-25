import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LoginSchema = z.object({
  email: z.email('必须是有效的邮箱地址').describe('邮箱'),
  password: z.string('密码不可为空').min(6, '密码至少6个字符').describe('密码'),
});


// 不需要单独创建 Swagger 类
export class LoginDto extends createZodDto(LoginSchema) {}

// 导出类型供其他地方使用
export type LoginSchemaType = z.infer<typeof LoginSchema>
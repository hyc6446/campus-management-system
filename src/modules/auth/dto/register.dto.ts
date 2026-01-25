import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { RoleType } from '@app/modules/role/role.entity'

export const RegisterSchema = z.object({
  email: z.email('必须是有效的邮箱地址').describe('邮箱'),
  password: z.string('密码不可为空').min(6, '密码至少6个字符').describe('密码'),
  username: z.string().min(2, '用户名至少2个字符').describe('用户名'),
  role: z.enum(RoleType).default(RoleType.STUDENT).describe('分配角色'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;

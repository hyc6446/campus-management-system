import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const RefreshTokenSchema = z.object({
  // 刷新令牌字段：必须是字符串且至少包含10个字符
  refreshToken: z.string('刷新Token不可为空').min(10, '无效的刷新令牌').describe('刷新Token'),
});

export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}
export type RefreshTokenSchemaType = z.infer<typeof RefreshTokenSchema>;
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const RefreshTokenSchema = z.object({
  refreshToken: z.string('刷新Token不可为空').min(10, '无效的刷新令牌').trim().describe('刷新Token'),
});

export const refreshTokenResponseSchema = z.object({
  accessToken: z.string().default(''),
})
export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}
export type RefreshTokenSchemaType = z.infer<typeof RefreshTokenSchema>;
import { z } from 'zod';
import {createZodDto} from 'nestjs-zod'
import { TokenType } from '@prisma/client';

export const CreateTokenSchema = z.object({
  userId: z.number().int('用户ID必须是整数').describe('用户ID'),
  token: z.string('令牌内容不能为空').describe('令牌内容'),
  type: z.enum(TokenType, '必须是有效的令牌类型').describe('令牌类型'),
  expiresAt: z.date().min(new Date(), '过期时间必须在当前时间之后').describe('过期时间'),
});

export type CreateTokenType = z.infer<typeof CreateTokenSchema>;
export class CreateTokenDto extends createZodDto(CreateTokenSchema) {}
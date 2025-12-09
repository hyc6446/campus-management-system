import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { TokenType } from '@prisma/client';

export const CreateTokenSchema = z.object({
  userId: z.number().int().min(1, '用户ID必须是有效的数字'),
  token: z.string().min(1, '令牌内容不能为空'),
  type: z.nativeEnum(TokenType, '必须是有效的令牌类型'),
  expiresAt: z.date().min(new Date(), '过期时间必须在当前时间之后'),
  revoked: z.boolean().default(false),
});

export type CreateTokenDto = z.infer<typeof CreateTokenSchema>;

export class CreateTokenDtoSwagger {
  @ApiProperty({ example: 1, description: '用户ID' })
  userId: number = 0;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: '令牌内容' })
  token: string = '';

  @ApiProperty({ example: TokenType.REFRESH, description: '令牌类型', enum: TokenType })
  type: TokenType = TokenType.REFRESH;

  @ApiProperty({ example: '2023-12-31T23:59:59Z', description: '过期时间' })
  expiresAt: Date = new Date();

  @ApiProperty({ example: false, description: '是否已撤销', default: false })
  revoked: boolean = false;
}

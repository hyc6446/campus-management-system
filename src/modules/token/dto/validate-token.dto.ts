import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { TokenType } from '@prisma/client';

export const ValidateTokenSchema = z.object({
  token: z.string().min(1, '令牌内容不能为空'),
  type: z.nativeEnum(TokenType, '必须是有效的令牌类型').optional(),
});

export type ValidateTokenDto = z.infer<typeof ValidateTokenSchema>;

export class ValidateTokenDtoSwagger {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: '令牌内容' })
  token: string = '';

  @ApiPropertyOptional({ example: TokenType.REFRESH, description: '令牌类型', enum: TokenType })
  type: TokenType = TokenType.REFRESH;
}

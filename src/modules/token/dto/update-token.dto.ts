import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const UpdateTokenSchema = z.object({
  revoked: z.boolean().optional(),
  expiresAt: z.date().optional(),
});

export type UpdateTokenDto = z.infer<typeof UpdateTokenSchema>;

export class UpdateTokenDtoSwagger {
  @ApiPropertyOptional({ example: true, description: '是否已撤销' })
  revoked?: boolean;

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z', description: '过期时间' })
  expiresAt?: Date;
}

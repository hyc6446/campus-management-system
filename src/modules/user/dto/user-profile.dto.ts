import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const UserProfileSchema = z.object({
  username: z.string().min(2, '用户名至少2个字符').optional(),
  avatar: z.any().optional(), // 文件上传
});

export type UserProfileDto = z.infer<typeof UserProfileSchema>;

export class UserProfileDtoSwagger {
  @ApiPropertyOptional({ example: '张三', description: '用户姓名', minLength: 2 })
  name: string = '';

  @ApiPropertyOptional({ type: 'string', format: 'binary', description: '用户头像文件' })
  avatar: string = '';
}
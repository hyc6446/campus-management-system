import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.email('必须是有效的邮箱地址'),
  password: z.string().min(8, '密码至少8个字符'),
  userName: z.string().min(1, '名字至少1个字符'),
  roleId:  z.coerce.number().int().min(1, '角色ID不能为空且必须是有效的角色ID'),
  // classIds: z.array(z.coerce.number()).optional(),
  // childrenIds: z.array(z.coerce.number()).optional(),
  isActive: z.boolean().default(true),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export class CreateUserDtoSwagger {
  @ApiProperty({ example: 'user@example.com', description: '用户邮箱', uniqueItems: true })
  email: string = '';

  @ApiProperty({ example: 'password123', description: '用户密码', minLength: 8 })
  password: string = '';

  @ApiProperty({ example: '张三', description: '用户名字', minLength: 1 })
  userName: string = '';

  @ApiProperty({ example: 1, description: '用户角色ID', minimum: 1 })
  roleId!: number;

  // @ApiPropertyOptional({ 
  //   example: [1, 2], 
  //   description: '班级ID列表(仅教师/学生使用)',
  //   type: [Number],
  //   required: false
  // })
  // classIds?: number[];

  // @ApiPropertyOptional({ 
  //   example: [1, 2], 
  //   description: '子女ID列表(仅家长使用)',
  //   type: [Number],
  //   required: false
  // })
  // childrenIds?: number[];

  @ApiPropertyOptional({ 
    example: true, 
    description: '账号是否激活',
    default: true,
    required: false
  })
  isActive?: boolean;
}
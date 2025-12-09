import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';


export const UpdateUserSchema = z.object({
  userName: z.string().min(2, '用户名至少2个字符').optional(),
  avatarUrl: z.string().url('请输入有效的URL').optional(),
  phone: z.string().min(10, '手机号至少10个字符').optional(),
  roleId:  z.coerce.number().int().optional(),
  isActive: z.boolean().optional(),
  // classIds: z.array(z.string()).optional(),
  // childrenIds: z.array(z.string()).optional(),
  // 注意: 不允许直接修改email和password
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export class UpdateUserDtoSwagger {
  @ApiPropertyOptional({ example: '张三', description: '用户姓名', minLength: 2 })
  name?: string;

  @ApiPropertyOptional({ example: [1, 2], description: '用户角色ID', minimum: 1 })
  roleId!: number;

  @ApiPropertyOptional({ example: false, description: '账号是否激活' })
  isActive?: boolean;

  @ApiPropertyOptional({ example: ['class-uuid-1', 'class-uuid-2'], description: '班级ID列表', type: [String] })
  classIds?: string[];

  @ApiPropertyOptional({ example: ['student-uuid-1', 'student-uuid-2'], description: '子女ID列表', type: [String] })
  childrenIds?: string[];
}
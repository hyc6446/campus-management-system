import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const UpdateRoleSchema = z.object({
  name: z.string().min(2, {
    message: '角色名称至少需要2个字符'
  }),
});

export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;

export class UpdateRoleDtoSwagger {
  @ApiProperty({
    example: 'STUDENT',              // 文档中显示的示例值
    description: '角色类型',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  name = 'STUDENT';
}
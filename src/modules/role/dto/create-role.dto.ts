import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateRoleSchema = z.object({
  // 角色名称字段：必须是字符串且至少包含1个字符
  name: z.string().min(2),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;

export class CreateRoleDtoSwagger {
  // 角色名称字段的Swagger文档配置
  @ApiProperty({
    example: 'STUDENT',              // 文档中显示的示例值
    description: '角色类型',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  name = 'STUDENT';
}   

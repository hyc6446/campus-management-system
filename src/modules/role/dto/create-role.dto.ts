// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export const CreateRoleSchema = z.object({
  // 角色名称字段：必须是字符串且至少包含1个字符
  name: z.string().min(1, '角色名称不能为空'),
  // 是否冻结字段：必须是布尔值，默认值为false
  isFrozen: z.boolean().optional().default(false),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;

export class CreateRoleDtoSwagger {
  // 角色名称字段的Swagger文档配置
  @ApiProperty({
    example: 'admin',              // 文档中显示的示例值
    description: '角色名称',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  name: string = '';
}   

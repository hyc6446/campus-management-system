// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/client';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export const CreatePermissionSchema = z.object({
  // 操作类型字段：必须是字符串且至少包含1个字符
  action: z.string().min(1, '操作类型不能为空'),
  // 操作对象类型字段：必须是字符串且至少包含1个字符
  subject: z.string().min(1, '操作对象类型不能为空'),
  // 操作条件字段：可选，必须是JSON值
  conditions: z.json().optional(),
  // 关联角色ID字段：必须是数字且至少包含1个字符
  roleId: z.number().min(1, '关联角色ID不能为空'),
  // 用户ID字段：必须是数字且至少包含1个字符
  createdAt: z.date().optional(),
  // 启用状态字段：可选，必须是布尔值
  isEnabled: z.boolean().optional(),
});

export type CreatePermissionDto = z.infer<typeof CreatePermissionSchema>;

export class CreatePermissionDtoSwagger {
  // 操作类型字段的Swagger文档配置
  @ApiProperty({
    example: 'create',              // 文档中显示的示例值
    description: '操作类型',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  action!: string;
  // 操作对象类型字段的Swagger文档配置
  @ApiProperty({
    example: 'user',              // 文档中显示的示例值
    description: '操作对象类型',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  subject!: string;
  // 操作条件字段的Swagger文档配置
  @ApiProperty({
    example: '{"name": "Admin"}',              // 文档中显示的示例值
    description: '操作条件',       // 文档中显示的字段描述
    type: Object,                  // 字段类型
    required: false,                 // 是否为必填字段 
  })
  conditions!: JsonValue | null;
  // 操作时间字段的Swagger文档配置
  @ApiProperty({
    example: '2023-01-01T00:00:00Z',              // 文档中显示的示例值
    description: '操作时间',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: false                 // 是否为必填字段
  })
  createdAt!: Date;
  // 启用状态字段的Swagger文档配置
  @ApiProperty({
    example: true,              // 文档中显示的示例值
    description: '启用状态',       // 文档中显示的字段描述
    type: Boolean,                  // 字段类型
    required: false                 // 是否为必填字段
  })
  isEnabled!: boolean | null;
}   

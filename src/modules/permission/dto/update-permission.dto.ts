// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/client';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export const UpdatePermissionSchema = z.object({
  // 角色ID字段：必须是字符串且符合角色ID格式
  id: z.number().min(1, '权限ID不能为空'),
  // 操作字段：必须是字符串且至少包含1个字符
  action: z.string().min(1, '操作类型不能为空'),
  // 资源字段：必须是字符串且至少包含1个字符
  subject: z.string().min(1, '操作资源类型不能为空'),
  // 资源ID字段：可选，必须是字符串
  conditions: z.object({}).optional(),
  // 操作详情字段：必须是字符串且至少包含1个字符
  roleId: z.number().min(1, '角色ID不能为空'), 
  // 启用状态字段：可选，必须是布尔值
  isEnabled: z.boolean().optional(),
});

export type UpdatePermissionDto = z.infer<typeof UpdatePermissionSchema>;

export class UpdatePermissionDtoSwagger {
  // 权限ID字段的Swagger文档配置
  @ApiProperty({
    example: 123456,             // 文档中显示的示例值
    description: '权限ID',           // 文档中显示的字段描述
    type: Number,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  id!: number;
  // 操作字段的Swagger文档配置
  @ApiProperty({
    example: 'create',             // 文档中显示的示例值
    description: '操作类型',          // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  action: string = '';
  // 资源字段的Swagger文档配置
  @ApiProperty({
    example: 'user',             // 文档中显示的示例值
    description: '操作条件类型',          // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  subject: string = '';
  // 资源ID字段的Swagger文档配置
  @ApiProperty({
    example: '123456',             // 文档中显示的示例值
    description: '操作条件',          // 文档中显示的字段描述
    type: Object,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  conditions?: JsonValue | null = null;
  // 操作详情字段的Swagger文档配置
  @ApiProperty({
    example: 123456,             // 文档中显示的示例值
    description: '关联角色ID',          // 文档中显示的字段描述
    type: Number,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  roleId!: number;
  // 操作详情字段的Swagger文档配置
  @ApiProperty({
    example: new Date(),             // 文档中显示的示例值
    description: '操作更新时间',          // 文档中显示的字段描述
    type: Date,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  updatedAt: Date = new Date();
  // 启用状态字段的Swagger文档配置
  @ApiProperty({
    example: true,             // 文档中显示的示例值
    description: '启用状态',          // 文档中显示的字段描述
    type: Boolean,                  // 字段类型
    required: false                 // 是否为必填字段
  })
  isEnabled?: boolean | null = true;
}
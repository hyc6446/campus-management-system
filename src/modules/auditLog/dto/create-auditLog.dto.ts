import { MethodEnum } from "@app/common/types/audit-log.type";
import { ApiProperty } from '@nestjs/swagger';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export const CreateAuditLogSchema = z.object({
  // 用户ID字段：必须是数字且至少包含1个字符
  userId: z.number().min(1, '用户ID不能为空'),
  // 操作字段：必须是字符串且至少包含1个字符
  action: z.string().min(1, '操作类型不能为空'),
  // 资源字段：必须是字符串且至少包含1个字符
  resource: z.string().min(1, '操作资源类型不能为空'),
  // 资源ID字段：必须是字符串且至少包含1个字符
  resourceId: z.string().optional(),
  // HTTP方法字段：必须是MethodEnum枚举的字符串键之一
  method: z.enum(Object.keys(MethodEnum) as [string, ...string[]]),
  // 请求路径字段：必须是字符串且至少包含1个字符
  path: z.string().min(1, '请求路径不能为空'),
  // 是否成功字段：可选，必须是布尔值
  isSuccess: z.boolean().optional(),
  // 操作时长字段：可选，必须是整数且非负
  duration:  z.number().int().nonnegative(),
  // 操作时间字段：可选，必须是日期时间字符串
  timestamp: z.date().optional(),
  // 操作详情字段：必须是字符串且至少包含1个字符
  details: z.object({
    params: z.record(z.any(), z.string()).optional(),
    result: z.record(z.any(), z.string()).optional(),
    error: z.record(z.any(), z.string()).optional()
  }), 
  // 用户IP地址字段：可选，必须是字符串
  ip: z.string().optional(),
  // 用户浏览器信息：可选，必须是字符串
  userAgent: z.string().optional(),
  // 操作时间字段：可选，必须是日期时间字符串
  createdAt: z.date().optional(),
});

export type CreateAuditLogDto = z.infer<typeof CreateAuditLogSchema>;

export class CreateAuditLogDtoSwagger {
  // 角色名称字段的Swagger文档配置
  @ApiProperty({
    example: 1,              // 文档中显示的示例值
    description: '用户ID',       // 文档中显示的字段描述
    type: Number,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  userId!: number;
  // 操作字段的Swagger文档配置
  @ApiProperty({
    example: 'create',              // 文档中显示的示例值
    description: '操作类型',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  action!: string;
  // 资源字段的Swagger文档配置
  @ApiProperty({
    example: 'user',              // 文档中显示的示例值
    description: '操作资源类型',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  resource!: string;
  // 资源ID字段的Swagger文档配置
  @ApiProperty({
    example: '123',              // 文档中显示的示例值
    description: '操作资源ID',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  resourceId!: string;
  // 操作详情字段的Swagger文档配置
  @ApiProperty({
    example: '{"name": "Admin"}',              // 文档中显示的示例值
    description: '操作详情',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  details!: string;
  // 用户IP地址字段的Swagger文档配置
  @ApiProperty({
    example: '192.168.1.1',              // 文档中显示的示例值
    description: '用户IP地址',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: false                 // 是否为必填字段
  })
  ip!: string;
  // 用户浏览器信息字段的Swagger文档配置
  @ApiProperty({
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',              // 文档中显示的示例值
    description: '用户浏览器信息',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: false                 // 是否为必填字段
  })
  userAgent!: string;
  // 操作时间字段的Swagger文档配置
  @ApiProperty({
    example: '2023-01-01T00:00:00Z',              // 文档中显示的示例值
    description: '操作时间',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: false                 // 是否为必填字段
  })
  createdAt!: Date;
  
}   

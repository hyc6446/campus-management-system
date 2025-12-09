// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export const UpdateAuditLogSchema = z.object({
  // 角色ID字段：必须是字符串且符合角色ID格式
  auditLogId: z.number().min(1, '审计日志ID不能为空'),
  // 操作字段：必须是字符串且至少包含1个字符
  action: z.string().min(1, '操作类型不能为空'),
  // 资源字段：必须是字符串且至少包含1个字符
  resource: z.string().min(1, '操作资源类型不能为空'),
  // 资源ID字段：可选，必须是字符串
  resourceId: z.string().optional(),
  // 操作详情字段：必须是字符串且至少包含1个字符
  details: z.json(), 
});

export type UpdateAuditLogDto = z.infer<typeof UpdateAuditLogSchema>;

/**
 * 更新审计日志请求Swagger文档类
 * 
 * 专门用于生成Swagger API文档的类，定义了API文档中显示的字段信息：
 * - 字段名称、类型、示例值、描述等
 * 
 * 此类不会在实际业务逻辑中使用，仅用于文档生成
 */
export class UpdateAuditLogDtoSwagger {
  // 审计日志ID字段的Swagger文档配置
  @ApiProperty({
    example: 123456,             // 文档中显示的示例值
    description: '审计日志ID',          // 文档中显示的字段描述
    type: Number,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  auditLogId: number = 0;
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
    description: '操作资源类型',          // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  resource: string = '';
  // 资源ID字段的Swagger文档配置
  @ApiProperty({
    example: '123456',             // 文档中显示的示例值
    description: '操作资源ID',          // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  resourceId: string = '';
  // 操作详情字段的Swagger文档配置
  @ApiProperty({
    example: '{"name": "张三"}',             // 文档中显示的示例值
    description: '操作详情',          // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  details: string = '';
}
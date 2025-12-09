// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export const UpdateRoleSchema = z.object({
  // 角色ID字段：必须是字符串且符合角色ID格式
  roleId: z.string().min(1, '角色ID不能为空'),
  // 角色名称字段：必须是字符串且至少包含2个字符
  name: z.string().min(2, '角色名称至少2个字符'),
  // 是否冻结字段：必须是布尔值，默认值为false
  isFrozen: z.boolean().optional().default(false),
});

export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;

/**
 * 登录请求Swagger文档类
 * 
 * 专门用于生成Swagger API文档的类，定义了API文档中显示的字段信息：
 * - 字段名称、类型、示例值、描述等
 * 
 * 此类不会在实际业务逻辑中使用，仅用于文档生成
 */
export class UpdateRoleDtoSwagger {
  // 角色ID字段的Swagger文档配置
  @ApiProperty({
    example: '123456',             // 文档中显示的示例值
    description: '角色ID',          // 文档中显示的字段描述
    type: String,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  roleId: string = '';

  // 角色名称字段的Swagger文档配置
  @ApiProperty({
    example: 'Admin',              // 文档中显示的示例值
    description: '角色名称',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    minLength: 2,                  // 最小长度限制
    required: true                 // 是否为必填字段
  })
  name: string = '';

}
/**
 * 刷新令牌请求数据传输对象（DTO）
 * 
 * 此文件定义了刷新访问令牌时所需的数据结构、验证规则和Swagger文档配置。
 * 包含三个核心部分：
 * 1. Zod验证模式：用于运行时验证请求数据
 * 2. TypeScript类型：用于编译时类型检查
 * 3. Swagger文档类：用于生成API文档
 */

// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';

/**
 * 刷新令牌请求验证模式
 * 
 * 使用Zod库定义的验证规则，确保刷新令牌请求数据符合预期格式：
 * - refreshToken：必须是字符串且至少包含10个字符（确保是有效的令牌格式）
 * 
 * 此模式用于在请求到达控制器时验证请求体数据的有效性
 */
export const RefreshTokenSchema = z.object({
  // 刷新令牌字段：必须是字符串且至少包含10个字符
  refreshToken: z.string().min(10, '无效的刷新令牌'),
});

/**
 * 刷新令牌请求类型定义
 * 
 * 通过z.infer从RefreshTokenSchema自动推断出TypeScript类型，
 * 确保类型安全并与验证规则保持一致
 * 
 * 此类型用于在控制器和服务层中进行类型检查
 */
export type RefreshDto = z.infer<typeof RefreshTokenSchema>;

/**
 * 刷新令牌请求Swagger文档类
 * 
 * 专门用于生成Swagger API文档的类，定义了API文档中显示的字段信息：
 * - 字段名称、类型、示例值、描述等
 * 
 * 此类不会在实际业务逻辑中使用，仅用于文档生成
 */
export class RefreshDtoSwagger {
  // 刷新令牌字段的Swagger文档配置
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // 文档中显示的示例令牌
    description: '刷新令牌',                               // 文档中显示的字段描述
    type: String,                                          // 字段类型
    required: true                                         // 是否为必填字段
  })
  refreshToken: string = '';
}
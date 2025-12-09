/**
 * 用户注册请求数据传输对象（DTO）
 * 
 * 此文件定义了用户注册时所需的数据结构、验证规则和Swagger文档配置。
 * 包含四个核心部分：
 * 1. 角色枚举：定义系统支持的用户角色
 * 2. Zod验证模式：用于运行时验证请求数据
 * 3. TypeScript类型：用于编译时类型检查
 * 4. Swagger文档类：用于生成API文档
 */

// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export enum RoleName {
  STUDENT = 'STUDENT',  // 学生角色
  TEACHER = 'TEACHER',  // 教师角色
  PARENT = 'PARENT',    // 家长角色
  ADMIN = 'ADMIN'       // 管理员角色
}

export const RegisterSchema = z.object({
  // 邮箱字段：必须是字符串、有效邮箱格式且至少5个字符
  email: z.string().email('必须是有效的邮箱地址').min(5, '邮箱至少5个字符'),
  // 密码字段：必须是字符串且至少8个字符
  password: z.string().min(8, '密码至少8个字符'),
  // 用户名字段：必须是字符串且至少1个字符
  username: z.string().min(1, '用户名至少1个字符'),
  // 角色字段：必须是RoleName枚举中的值，默认值为STUDENT
  role: z.nativeEnum(RoleName).default(RoleName.STUDENT),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export class RegisterDtoSwagger {
  // 邮箱字段的Swagger文档配置
  @ApiProperty({
    example: 'user@example.com',  // 文档中显示的示例邮箱
    description: '用户邮箱',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    minLength: 5,                  // 最小长度限制
    required: true                 // 是否为必填字段
  })
  email: string = '';

  // 密码字段的Swagger文档配置
  @ApiProperty({
    example: 'password123',        // 文档中显示的示例密码
    description: '用户密码',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    minLength: 8,                  // 最小长度限制
    required: true                 // 是否为必填字段
  })
  password: string = '';

  // 名字字段的Swagger文档配置
  @ApiProperty({
    example: '张三',                 // 文档中显示的示例名字
    description: '用户名字',       // 文档中显示的字段描述
    type: String,                  // 字段类型
    minLength: 2,                  // 最小长度限制
    required: true                 // 是否为必填字段
  })
  username: string = '';


  // 角色字段的Swagger文档配置
  @ApiProperty({
    example: RoleName.STUDENT,     // 文档中显示的示例角色
    description: '用户角色',       // 文档中显示的字段描述
    enum: RoleName,                // 枚举类型定义
    default: RoleName.STUDENT,     // 默认值
    required: false                // 是否为必填字段（有默认值，所以为可选）
  })
  role: RoleName = RoleName.STUDENT;
}
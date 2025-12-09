
// 导入Swagger的ApiProperty装饰器，用于定义API文档中的请求字段
import { ApiProperty } from '@nestjs/swagger';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export const QueryPermissionSchema = z.object({
  // 页码字段：必须是整数且大于等于1
  page: z.number().int().min(1, '页码必须大于等于1'),
  // 每页数量字段：必须是整数且大于等于1
  pageSize: z.number().int().min(10, '每页数量必须大于等于10'),
});

export type QueryPermissionDto = z.infer<typeof QueryPermissionSchema>;

export class QueryPermissionDtoSwagger {
  // 页码字段的Swagger文档配置
  @ApiProperty({
    example: 1,                    // 文档中显示的示例值
    description: '页码',            // 文档中显示的字段描述
    type: Number,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  page: number = 1;

  // 每页数量字段的Swagger文档配置
  @ApiProperty({
    example: 10,                   // 文档中显示的示例值
    description: '每页数量',        // 文档中显示的字段描述
    type: Number,                  // 字段类型
    required: true                 // 是否为必填字段
  })
  pageSize: number = 10;
  
}


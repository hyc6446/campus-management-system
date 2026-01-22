// import { IsOptional, IsInt,IsNumber, Min, Max, IsString, IsEnum, IsIn } from 'class-validator';
// import { Type,Transform  } from 'class-transformer';
// import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { PERMISSION_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


export const QueryPermissionSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  // 筛选参数,支持多字段筛选
  id: z.coerce.number().int().optional(),
  action: z.string().optional(),
  subject: z.string().optional(),
  roleId: z.coerce.number().int().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  // 排序方式
  sortBy: z.string().optional().default('createdAt'),
  order: z.string().optional().default('desc'),
}).transform((data) => {
  const originalSortFields = data.sortBy.split(',');
  const validSortFields: string[] = [];
  const originalSortOrders = data.order.split(',');
  const validSortOrders: string[] = [];
  originalSortFields.forEach((field, index) => {
    const trimmedField = field.trim();
    if (PERMISSION_ALLOWED_SORT_FIELDS.includes(trimmedField as any)) {
      validSortFields.push(trimmedField);
      const originalOrder = originalSortOrders[index]?.trim().toLowerCase() || 'desc';
      const validOrder = ['asc', 'desc'].includes(originalOrder) ? originalOrder : 'desc';
      validSortOrders.push(validOrder);
    }
  });
  if (validSortFields.length === 0) {
    validSortFields.push('createdAt');
    validSortOrders.push('desc');
  }
  return {
    ...data,
    sortBy: validSortFields.join(','),
    order: validSortOrders.join(',')
  }
});

export type QueryPermissionDto = z.infer<typeof QueryPermissionSchema>;

export class QueryPermissionDtoSwagger {
}


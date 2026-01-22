import { IsOptional, IsInt,IsNumber, Min, Max, IsString, IsEnum, IsIn } from 'class-validator';
import { Type,Transform  } from 'class-transformer';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { ROLE_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types';
import { z } from 'zod';


export const QueryRoleSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  // 筛选参数,支持多字段筛选
  id: z.coerce.number().int().optional(),
  name: z.string().optional(),
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
    if (ROLE_ALLOWED_SORT_FIELDS.includes(trimmedField as any)) {
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


export type QueryRoleDto = z.infer<typeof QueryRoleSchema>;

/**
 * 角色查询DTO
 * 统一处理分页、筛选和排序条件
 */
export class QueryRoleDtoSwagger {
  @ApiPropertyOptional({ default: 1, description: '页码' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({ default: 10, description: '每页数量' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(5, { message: '每页数量至少5条' })
  @Max(100, { message: '每页数量最多100条' })
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;

  // 筛选参数,支持多字段筛选
  @ApiPropertyOptional({ description: '角色ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '角色ID必须是整数' })
  @Transform(({ value }) => parseInt(value))
  id?: number;

  @ApiPropertyOptional({ description:'角色名称', example: 'ADMIN' })
  @IsOptional()
  @Type(() => String)
  @IsString({ message: '角色名称必须是字符串' })
  @Transform(({ value }) => value.trim())
  name?: string;

  @ApiPropertyOptional({ description: '创建时间', example: '2025-01-01' })
  @IsOptional()
  @Type(() => String)
  @IsString({ message: '创建时间必须是字符串' })
  @Transform(({ value }) => value.trim())
  createdAt?: string;

  // 排序参数
  @ApiPropertyOptional({ description: '排序字段', example: 'createdAt' })
  @IsOptional()
  @Type(() => String)
  @IsString({ message: '排序参数必须是字符串' })
  // @IsIn(ALLOWED_SORT_FIELDS, { message: '排序字段无效' })
  // @Transform(({ value }) => value.trim())
  sortBy?: string;

  // 排序方式
  // @ApiPropertyOptional({ description: '排序方式', example: 'asc' })
  // @IsOptional()
  // @IsString({ message: '排序方式必须是字符串' })
  // @IsIn(['ASC', 'DESC'], { message: '排序方式无效' })
  // @Transform(({ value }) => value.trim().toUpperCase())
  // order?: 'ASC' | 'DESC' = 'DESC';
}
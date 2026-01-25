import { createZodDto } from 'nestjs-zod'
import { paginationSchema, createSortingSchema } from '@app/common/validators/zod-validators'
import { PERMISSION_ALLOWED_SORT_FIELDS } from '@app/common/prisma-types';
// 导入Zod库，用于定义数据验证模式
import { z } from 'zod';


// export const QueryPermissionSchema = paginationSchema
//   .merge(
//     z.object({
//       // 筛选参数,支持多字段筛选
//       id: z.coerce.number().int('权限ID必须是整数').optional().describe('权限ID'),
//       action: z.string().optional().describe('动作'),
//       subject: z.string().optional().describe('对象'),
//       roleId: z.coerce.number().int('角色ID必须是整数').optional().describe('角色ID'),
//       createdAt: z.union([z.string(), z.date()]).optional().describe('创建时间'),
//     })
//   )
//   .merge(createSortingSchema(PERMISSION_ALLOWED_SORT_FIELDS));

export const QueryPermissionSchema = z.object({
  id: z.coerce.number().int('权限ID必须是整数').optional().describe('权限ID'),
  action: z.string().optional().describe('动作'),
  subject: z.string().optional().describe('对象'),
  roleId: z.coerce.number().int('角色ID必须是整数').optional().describe('角色ID'),
  createdAt: z.union([z.string(), z.date()]).optional().describe('创建时间'),
}).extend(paginationSchema.shape).extend(createSortingSchema(PERMISSION_ALLOWED_SORT_FIELDS).shape);



export class QueryPermissionDto extends createZodDto(QueryPermissionSchema) {}

export type QueryPermissionType = z.infer<typeof QueryPermissionSchema>;


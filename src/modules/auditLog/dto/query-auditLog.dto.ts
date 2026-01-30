import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryAuditLogSchema = z.object({});

export type QueryAuditLogType = z.infer<typeof QueryAuditLogSchema>;
export class QueryAuditLogDto extends createZodDto(QueryAuditLogSchema) {};

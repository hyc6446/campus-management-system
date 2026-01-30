import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateAuditLogSchema = z.object({});

export type UpdateAuditLogType = z.infer<typeof UpdateAuditLogSchema>;
export class UpdateAuditLogDto extends createZodDto(UpdateAuditLogSchema) {};

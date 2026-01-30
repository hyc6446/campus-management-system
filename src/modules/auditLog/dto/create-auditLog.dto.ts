import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateAuditLogSchema = z.object({});

export type CreateAuditLogType = z.infer<typeof CreateAuditLogSchema>;
export class CreateAuditLogDto extends createZodDto(CreateAuditLogSchema) {};

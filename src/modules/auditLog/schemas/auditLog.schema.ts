// 从DTO模块导入预定义的Zod验证模式
import { CreateAuditLogSchema, UpdateAuditLogSchema } from '../dto/index';

export const validateCreateAuditLog = (data: unknown) => {
  return CreateAuditLogSchema.parse(data);
};

export const validateUpdateAuditLog = (data: unknown) => {
  return UpdateAuditLogSchema.parse(data);
};

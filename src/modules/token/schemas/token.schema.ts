
// 从DTO模块导入预定义的Zod验证模式
import { CreateTokenSchema, UpdateTokenSchema, ValidateTokenSchema } from '../dto/index';

export const validateCreateToken = (data: unknown) => {
  return CreateTokenSchema.parse(data);
};

export const validateUpdateToken = (data: unknown) => {
  return UpdateTokenSchema.parse(data);
};
export const validateValidateToken = (data: unknown) => {
  return ValidateTokenSchema.parse(data);
};

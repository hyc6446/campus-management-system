import { z } from 'zod';
import { CreateUserSchema, UpdateUserSchema, UserProfileSchema } from './dto';

// 验证创建用户请求
export const validateCreateUser = (data: unknown) => {
  return CreateUserSchema.parse(data);
};

// 验证更新用户请求
export const validateUpdateUser = (data: unknown) => {
  return UpdateUserSchema.parse(data);
};

// 验证更新个人资料请求
export const validateUserProfile = (data: unknown) => {
  return UserProfileSchema.parse(data);
};
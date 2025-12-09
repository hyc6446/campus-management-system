// 统一导出所有DTO类、Schema和类型
import { CreateUserSchema, CreateUserDtoSwagger, type CreateUserDto } from './create-user.dto';
import { UpdateUserSchema, UpdateUserDtoSwagger, type UpdateUserDto } from './update-user.dto';
import { UserProfileSchema, UserProfileDtoSwagger, type UserProfileDto } from './user-profile.dto';


export {
  // Swagger类
  CreateUserDtoSwagger,
  UpdateUserDtoSwagger,
  UserProfileDtoSwagger,
  // Schema
  CreateUserSchema,
  UpdateUserSchema,
  UserProfileSchema,
  // 类型
  CreateUserDto,
  UpdateUserDto,
  UserProfileDto,
};
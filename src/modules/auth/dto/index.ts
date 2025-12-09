// 统一导出所有DTO类、Schema和类型
import { LoginDtoSwagger, LoginSchema, type LoginDto } from './login.dto';
import { RoleName, RegisterDtoSwagger, RegisterSchema, type RegisterDto } from './register.dto';
import { RefreshDtoSwagger, RefreshTokenSchema, type RefreshDto } from './refresh.dto';

export {
  RoleName,
  // Swagger类
  LoginDtoSwagger,
  RegisterDtoSwagger,
  RefreshDtoSwagger,
  // Schema
  LoginSchema,
  RegisterSchema,
  RefreshTokenSchema,
  // 类型
  LoginDto,
  RegisterDto,
  RefreshDto,
};
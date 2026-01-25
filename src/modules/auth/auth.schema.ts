// import { LoginSchema, RegisterSchema, RefreshTokenSchema } from './dto/index';

// /**
//  * 验证登录请求数据
//  * 
//  * 使用LoginSchema验证登录请求的合法性，确保请求包含必要的字段且格式正确。
//  * 适用于需要在服务层或其他非控制器层进行手动验证的场景。
//  * 
//  * @param data 未知类型的登录请求数据
//  * @returns 验证通过的登录数据，类型为LoginSchema的推断类型
//  * @throws ZodError 验证失败时抛出，包含详细的错误信息
//  * 
//  * @example
//  * ```typescript
//  * try {
//  *   const loginData = validateLogin({ email: 'user@example.com', password: 'password123' });
//  *   // 使用验证后的数据
//  * } catch (error) {
//  *   // 处理验证错误
//  * }
//  * ```
//  */
// export const validateLogin = (data: unknown) => {
//   return LoginSchema.parse(data);
// };

// export const validateRegister = (data: unknown) => {
//   return RegisterSchema.parse(data);
// };

// export const validateRefresh = (data: unknown) => {
//   return RefreshTokenSchema.parse(data);
// };
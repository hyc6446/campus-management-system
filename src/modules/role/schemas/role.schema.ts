
// 从DTO模块导入预定义的Zod验证模式
import { CreateRoleSchema, UpdateRoleSchema } from '../dto/index';

/**
 * 验证创建角色请求数据
 * 
 * 使用CreateRoleSchema验证创建角色请求的合法性，确保请求包含必要的字段且格式正确。
 * 适用于需要在服务层或其他非控制器层进行手动验证的场景。
 * 
 * @param data 未知类型的创建角色请求数据
 * @returns 验证通过的创建角色数据，类型为CreateRoleSchema的推断类型
 * @throws ZodError 验证失败时抛出，包含详细的错误信息
 * 
 * @example
 * ```typescript
 * try {
 *   const createRoleData = validateCreateRole({ name: 'ROLE_ADMIN', isFrozen: false });
 *   // 使用验证后的数据
 * } catch (error) {
 *   // 处理验证错误
 * }
 * ```
 */
export const validateCreateRole = (data: unknown) => {
  return CreateRoleSchema.parse(data);
};

export const validateUpdateRole = (data: unknown) => {
  return UpdateRoleSchema.parse(data);
};

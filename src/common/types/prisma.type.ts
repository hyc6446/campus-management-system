import { Prisma } from '@prisma/client';
import { DEFAULT_SAFE_USER_SELECT,DEFAULT_USER_WITH_ROLE } from '@common/prisma/composite.selects';




export type DEFAULT_SAFE_USER_TYPE = typeof DEFAULT_SAFE_USER_SELECT;
export type DEFAULT_USER_WITH_ROLE_TYPE = typeof DEFAULT_USER_WITH_ROLE;

/**
 * 泛型用户查询返回类型 - 支持动态select配置
 * @template Select 自定义select配置，默认使用DEFAULT_SAFE_USER_SELECT.select
 */
export type FindUserById<
  Select extends Prisma.UserSelect = typeof DEFAULT_SAFE_USER_SELECT.select
> = Prisma.UserGetPayload<{
  where: { id: number; deletedAt: null };
  select: Select;
}>;

export type FindUserByEmail<
  Select extends Prisma.UserSelect = typeof DEFAULT_SAFE_USER_SELECT.select
> = Prisma.UserGetPayload<{
  where: { email: string; deletedAt: null };
  select: Select;
}>;





// import { Exclude } from 'class-transformer';

// 角色实体类 - 与Prisma schema保持一致
export class Role {
  // 自增ID，与Prisma schema匹配
  id: number;

  // 角色名称，唯一约束
  name: string;

  // 是否冻结：标识角色是否被禁用，默认启用
  isFrozen: boolean = false;

  // 创建时间
  createdAt: Date;

  // 更新时间
  updatedAt: Date | null = null;

  // 构造函数初始化默认值
  constructor(partial: Partial<Role> = {}) {
    this.id = partial.id || 0;
    this.name = partial.name || '';
    this.isFrozen = partial.isFrozen || false;
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || null;
  }
}
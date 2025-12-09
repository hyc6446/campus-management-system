// import { Exclude } from 'class-transformer';

import { JsonValue } from "@prisma/client/runtime/client";

// 审计日志实体类 - 与Prisma schema保持一致
export class AuditLog {
  // 自增ID，与Prisma schema匹配
  id: number;
  // 关联用户ID，与Prisma schema匹配
  userId!: number;
  // 操作类型，与Prisma schema匹配
  action: string = '';
  // 操作资源类型，与Prisma schema匹配
  resource: string = '';
  // 操作资源ID，与Prisma schema匹配
  resourceId?: string | null;
  // 操作详情
  details: JsonValue = {};
  // 记录操作时的IP地址
  ip?: string | null;
  // 记录操作时的用户代理信息
  userAgent?: string | null;
  // 记录操作时的创建时间
  createdAt: Date = new Date();
  // 记录操作时的更新时间
  updatedAt: Date | null = null;
  // 记录软删除时间
  deletedAt?: Date | null = null;


  // 构造函数初始化默认值
  constructor(partial: Partial<AuditLog> = {}) {
    this.id = partial.id || 0;
    this.userId = partial.userId || 0;
    this.action = partial.action || '';
    this.resource = partial.resource || '';
    this.resourceId = partial.resourceId;
    this.details = partial.details || {};
    this.ip = partial.ip;
    this.userAgent = partial.userAgent;
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || null;
    this.deletedAt = partial.deletedAt || null;
  }
}
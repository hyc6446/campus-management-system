// import { Exclude } from 'class-transformer';

import { JsonValue } from "@prisma/client/runtime/client";

export class AuditLog {
  id: number;
  userId!: number;
  action: string = '';
  resource: string = '';
  resourceId?: string | null;
  details: JsonValue = {};
  ip?: string | null;
  userAgent?: string | null;
  createdAt: Date = new Date();
  updatedAt: Date | null = null;
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
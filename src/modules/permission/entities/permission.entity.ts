// import { Exclude } from 'class-transformer';

import { JsonValue } from '@prisma/client/runtime/client'

// 审计日志实体类 - 与Prisma schema保持一致
export class Permission {
  // 自增ID，与Prisma schema匹配
  id: number
  // 操作类型，与Prisma schema匹配
  action: string = ''
  // 操作对象类型，与Prisma schema匹配
  subject: string = ''
  // 操作条件，与Prisma schema匹配
  conditions?: JsonValue | null
  // 关联角色ID，与Prisma schema匹配
  roleId!: number
  // 记录操作时的创建时间
  createdAt: Date = new Date()
  // 记录操作时的更新时间
  updatedAt: Date | null = null
  // 启用状态：标识权限是否有效
  isEnabled?: boolean | null = true

  // 构造函数初始化默认值
  constructor(partial: Partial<Permission> = {}) {
    this.id = partial.id || 0
    this.action = partial.action || ''
    this.subject = partial.subject || ''
    this.conditions = partial.conditions || null
    this.roleId = partial.roleId || 0
    this.createdAt = partial.createdAt || new Date()
    this.updatedAt = partial.updatedAt || null
    this.isEnabled = partial.isEnabled || true
  }
}

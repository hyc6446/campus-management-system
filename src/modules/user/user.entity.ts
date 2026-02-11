import { Role } from '@modules/role/role.entity'

export class User {
  id: number
  email: string
  userName: string | null
  avatarUrl: string | null
  phone: string | null
  roleId: number
  failedLoginAttempts: number = 0
  lockUntil: Date | null


  // 构造函数初始化默认值
  constructor(partial: any = {}) {
    this.id = partial.id || 0
    this.email = partial.email || ''
    this.userName = partial.userName ?? null
    this.avatarUrl = partial.avatarUrl ?? null
    this.phone = partial.phone ?? null
    this.roleId = partial.role?.roleId || partial.role?.id || 0
    this.failedLoginAttempts = partial.failedLoginAttempts ?? 0
    this.lockUntil = partial.lockUntil ?? undefined
  }
}

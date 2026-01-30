export class Permission {
  id: number
  action: string = ''
  subject: string = ''
  roleId!: number
  createdAt: Date = new Date()
  updatedAt: Date | null = null
  
  // 构造函数初始化默认值
  constructor(partial: Partial<Permission> = {}) {
    this.id = partial.id || 0
    this.action = partial.action || ''
    this.subject = partial.subject || ''
    this.roleId = partial.roleId || 0
    this.createdAt = partial.createdAt || new Date()
    this.updatedAt = partial.updatedAt || null
  }
}

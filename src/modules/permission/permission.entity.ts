export class Permission {
  id: number
  action: string
  subject: string
  roleId: number
  
  // 构造函数初始化默认值
  constructor(partial: Partial<Permission> = {}) {
    this.id = partial.id || 0
    this.action = partial.action || ''
    this.subject = partial.subject || ''
    this.roleId = partial.roleId || 0
  }
}

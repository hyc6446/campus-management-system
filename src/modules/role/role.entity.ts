export class Role {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date | null = null
  
  // 构造函数初始化默认值
  constructor(partial: Partial<Role> = {}) {
    this.id = partial.id || 0
    this.name = partial.name || ''
    this.createdAt = partial.createdAt || new Date()
    this.updatedAt = partial.updatedAt || null
  }
}

export enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

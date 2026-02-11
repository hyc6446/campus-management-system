export class Role {
  id: number
  name: string


  // 构造函数初始化默认值
  constructor(partial: Partial<Role> = {}) {
    this.id = partial.id || 0
    this.name = partial.name || ''
  }
}

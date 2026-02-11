export class RuleConfig {
  id: number
  rule: string
  type: string
  
  // 构造函数初始化默认值
  constructor(partial: Partial<RuleConfig> = {}) {
    this.id = partial.id || 0
    this.rule = partial.rule || ''
    this.type = partial.type || ''
  }
}

export abstract class BaseEntity {
  id: number
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null

  protected constructor(data: Partial<BaseEntity> = {}) {
    this.id = data.id || 0
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt ?? null
    this.deletedAt = data.deletedAt ?? null
  }
  // 检查实体是否已被删除
  isDeleted(): boolean {
    return this.deletedAt !== null
  }

  // 软删除实体
  softDelete(): void {
    this.deletedAt = new Date()
    this.updatedAt = new Date()
  }
  // 恢复实体
  restore(): void {
    this.deletedAt = null
    this.updatedAt = new Date()
  }
  // 更新实体的更新时间
  touch(): void {
    this.updatedAt = new Date()
  }
}

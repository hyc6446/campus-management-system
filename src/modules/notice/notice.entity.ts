import { NoticeType } from '@prisma/client'

export class SystemNotice {
  id: number
  type: NoticeType
  publisherId?: number
  title: string
  content: string
  expireAt?: Date

  constructor(data: Partial<SystemNotice>) {
    this.id = data.id || 0
    this.type = data.type || NoticeType.ANNOUNCEMENT
    this.publisherId = data.publisherId || undefined
    this.title = data.title || ''
    this.content = data.content || ''
    this.expireAt = data.expireAt || undefined
  }
}

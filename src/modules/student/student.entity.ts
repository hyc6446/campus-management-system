export class Student {
  id: number
  name: string
  password?: string
  phone: string
  cardId: string
  classId: number

  constructor(data: Partial<Student>) {
    this.id = data.id || 0
    this.name = data.name || ''
    this.classId = data.classId || 0
    this.password = data.password || undefined
    this.phone = data.phone || ''
    this.cardId = data.cardId || ''
  }
}

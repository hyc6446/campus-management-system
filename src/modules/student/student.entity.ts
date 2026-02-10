export class Student {
  id: number
  name: string
  classId: number

  constructor(data: Partial<Student>) {
    this.id = data.id || 0
    this.name = data.name || ''
    this.classId = data.classId || 0
  }
}

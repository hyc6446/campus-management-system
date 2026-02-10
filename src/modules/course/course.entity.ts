export class Course {
  id: number
  name: string
  credit: number
  description?: string

  constructor(data: Partial<Course>) {
    this.id = data.id || 0
    this.name = data.name || ''
    this.credit = data.credit || 0
    this.description = data.description || undefined
  }
}

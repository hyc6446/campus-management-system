export class Class {
  id: number
  name: string
  description?: string

  constructor(partial: Partial<Class>) {
    this.id = partial.id || 0
    this.name = partial.name || ''
    this.description = partial.description || undefined
  }
}

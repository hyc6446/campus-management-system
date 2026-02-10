export class Book {
  id: number
  isbn: string
  name: string
  subname: string
  originalName: string
  author: string
  publisher: string
  publicationYear: number
  stock: number
  description: string

  constructor(partial: Partial<Book>) {
    this.id = partial.id || 0
    this.isbn = partial.isbn || ''
    this.name = partial.name || ''
    this.subname = partial.subname || ''
    this.originalName = partial.originalName || ''
    this.author = partial.author || ''
    this.publisher = partial.publisher || ''
    this.publicationYear = partial.publicationYear || 0
    this.stock = partial.stock || 0
    this.description = partial.description || ''
  }
}

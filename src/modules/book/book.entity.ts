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
  createdAt: Date
  updatedAt: Date | null
  deletedAt: Date | null

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
    this.createdAt = partial.createdAt || new Date()
    this.updatedAt = partial.updatedAt || null
    this.deletedAt = partial.deletedAt || null
  }

  static fromPrisma(prismaBook: any): Book {
    return new Book(prismaBook)
  }

  toPrismaInput(): any {
    return {
      id: this.id,
      isbn: this.isbn,
      name: this.name,
      subname: this.subname,
      originalName: this.originalName,
      author: this.author,
      publisher: this.publisher,
      publicationYear: this.publicationYear,
      stock: this.stock,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }
}

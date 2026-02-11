import { BaseEntity } from './base.entity'
import { BookStatus, BOOK_STATUS_LABELS, BookCategory } from './book-status'
import type { BookBaseType, BookPublicType, BookSummaryType } from './book-fields'
import { BookFrontendDto } from '../dto'


export class Book extends BaseEntity {
  isbn: string
  name: string
  subname: string | null
  originalName: string | null
  author: string | null
  publisher: string | null
  publicationYear: number | null
  stock: number
  description: string | null
  // category: BookCategory | null

  private static readonly MAX_BORROW_DAYS = 30
  private static readonly LOW_STOCK_THRESHOLD = 5
  private static readonly MAX_STOCK = 100
  private static readonly MIN_PUBLICATION_YEAR = 1900
  private static readonly CURRENT_YEAR = new Date().getFullYear()

  constructor(data: Partial<BookBaseType> = {}) {
    super(data)
    this.isbn = data.isbn || ''
    this.name = data.name || ''
    this.subname = data.subname ?? null
    this.originalName = data.originalName ?? null
    this.author = data.author ?? null
    this.publisher = data.publisher ?? null
    this.publicationYear = data.publicationYear ?? null
    this.stock = data.stock ?? 0
    this.description = data.description ?? null
  }
  // 从 Prisma 模型创建实体
  static fromPrisma(data: BookBaseType): Book {
    return new Book(data)
  }
  // 从 Prisma 模型数组创建实体数组
  static fromPrismaArray(data: BookBaseType[]): Book[] {
    return data.map(item => Book.fromPrisma(item))
  }
  // 转换为 Prisma 模型输入
  toPrismaInput(): Partial<BookBaseType> {
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
  // 获取完整名称（包含子名称）
  get fullName(): string {
    return this.subname ? `${this.name}:${this.subname}` : this.name
  }
  // 获取显示名称（包含原始名称）
  get displayName(): string {
    return this.originalName ? `${this.name}（${this.originalName}）` : this.name
  }
  // 检查图书是否为新出版
  get isNew(): boolean {
    if (!this.publicationYear) return false
    return this.publicationYear >= Book.CURRENT_YEAR - 3
  }
  // 检查图书是否为旧出版
  get isOld(): boolean {
    if (!this.publicationYear) return false
    return this.publicationYear < Book.CURRENT_YEAR - 10
  }
  // 获取图书状态
  get status(): BookStatus {  
    if (this.isDeleted()) return BookStatus.DELETED
    if (this.stock === 0) return BookStatus.OUT_OF_STOCK
    if (this.stock <= Book.LOW_STOCK_THRESHOLD) return BookStatus.LOW_STOCK
    return BookStatus.AVAILABLE
  }
  // 获取图书状态标签
  get statusLabel(): string {
    return BOOK_STATUS_LABELS[this.status]
  }
  // 获取库存水平
  get stockLevel(): 'high' | 'medium' | 'low' | 'empty' {
    if (this.stock === 0) return 'empty'
    if (this.stock <= Book.LOW_STOCK_THRESHOLD) return 'low'
    if (this.stock <= Book.LOW_STOCK_THRESHOLD * 2) return 'medium'
    return 'high'
  }
  // 获取出版信息
  get publicationInfo(): string {
    if (!this.publisher) return this.publicationYear ? `${this.publicationYear}年出版` : '出版信息未知'
    return this.publicationYear ? `${this.publisher} · ${this.publicationYear}年出版` : this.publisher
  }
  // 获取作者信息
  get authorInfo(): string {
    return this.author || '未知作者'
  }
  // 计算dueDate
  calculateDueDate(borrowDate: Date = new Date()): Date {
    const dueDate = new Date(borrowDate)
    dueDate.setDate(dueDate.getDate() + Book.MAX_BORROW_DAYS)
    return dueDate
  }

  // 检查图书是否可被借阅
  canBeBorrowed(): boolean {  
    return this.stock > 0 && !this.isDeleted()
  }
  // 检查图书是否可被删除
  canBeDeleted(): boolean {
    return this.stock === 0 && !this.isDeleted()
  }
  // 检查图书是否可被重新进货
  canBeRestocked(): boolean {
    return !this.isDeleted() && this.stock < Book.MAX_STOCK
  }
  // 检查图书是否需要重新进货
  needsRestock(): boolean {
    return this.stock <= Book.LOW_STOCK_THRESHOLD && !this.isDeleted()
  }
  // 计算需要补货的数量
  calculateRestockQuantity(): number {
    if (this.stock === 0) return 10
    if (this.stock <= Book.LOW_STOCK_THRESHOLD) return 5
    return 0
  }
  // 检查图书是否匹配关键词
  matchesKeyword(keyword: string): boolean {
    const lowerKeyword = keyword.toLowerCase()
    return Boolean(
      this.name.toLowerCase().includes(lowerKeyword) ||
      (this.author && this.author.toLowerCase().includes(lowerKeyword)) ||
      this.isbn.includes(lowerKeyword) ||
      (this.publisher && this.publisher.toLowerCase().includes(lowerKeyword))
    )
  }
  // 验证图书实体是否有效
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isbn || this.isbn.trim() === '') {
      errors.push('ISBN不能为空')
    } else if (!/^\d{10}$|^\d{13}$/.test(this.isbn.replace(/[-\s]/g, ''))) {
      errors.push('ISBN格式不正确，必须是10位或13位数字')
    }

    if (!this.name || this.name.trim() === '') {
      errors.push('书名不能为空')
    }

    if (this.publicationYear !== null) {
      if (this.publicationYear < Book.MIN_PUBLICATION_YEAR) {
        errors.push(`出版年份不能早于${Book.MIN_PUBLICATION_YEAR}年`)
      }
      if (this.publicationYear > Book.CURRENT_YEAR + 1) {
        errors.push(`出版年份不能晚于${Book.CURRENT_YEAR + 1}年`)
      }
    }

    if (this.stock < 0) {
      errors.push('库存不能为负数')
    }

    if (this.stock > Book.MAX_STOCK) {
      errors.push(`库存不能超过${Book.MAX_STOCK}`)
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
  // 借阅图书
  borrow(): void {
    if (!this.canBeBorrowed()) {
      if (this.stock <= 0) {
        throw new Error('库存不足，无法借阅')
      }
      if (this.isDeleted()) {
        throw new Error('图书已删除，无法借阅')
      }
    }
    this.stock -= 1
    this.touch()
  }
  // 归还图书
  returnBook(): void {
    if (this.stock >= Book.MAX_STOCK) {
      throw new Error('库存已达上限，无法归还')
    }
    this.stock += 1
    this.touch()
  }
  // 重新进货图书
  restock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('补货数量必须大于0')
    }
    if (this.stock + quantity > Book.MAX_STOCK) {
      throw new Error(`补货后库存将超过上限${Book.MAX_STOCK}`)
    }
    this.stock += quantity
    this.touch()
  }
  // 删除图书
  delete(): void {
    if (!this.canBeDeleted()) {
      if (this.stock > 0) {
        throw new Error('还有库存的图书不能删除')
      }
      if (this.isDeleted()) {
        throw new Error('图书已删除')
      }
    }
    this.softDelete()
  }
  // 转换为公开格式
  toPublic(): BookPublicType {
    return {
      id: this.id,
      isbn: this.isbn,
      name: this.name,
      subname: this.subname,
      originalName: this.originalName,
      author: this.author,
      publisher: this.publisher,
      publicationYear: this.publicationYear,
      description: this.description,
      createdAt: this.createdAt,
    }
  }
  // 转换为摘要格式
  toSummary(): BookSummaryType {
    return {
      id: this.id,
      isbn: this.isbn,
      name: this.name,
      author: this.author,
      stock: this.stock,
    }
  }
  // 转换为前端格式
  toFrontendFormat(): BookFrontendDto {
    return {
      id: this.id,
      isbn: this.formatIsbnForDisplay(),
      name: this.name,
      fullName: this.fullName,
      displayName: this.displayName,
      subname: this.subname,
      originalName: this.originalName,
      author: this.authorInfo,
      publisher: this.publisher,
      publicationYear: this.publicationYear,
      description: this.description,
      stock: this.stock,
      stockLevel: this.stockLevel,
      status: this.status,
      statusLabel: this.statusLabel,
      isNew: this.isNew,
      isOld: this.isOld,
      publicationInfo: this.publicationInfo,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString() || '',
    }
  }
  // 格式化ISBN显示格式
  private formatIsbnForDisplay(): string {
    const isbn = this.isbn.replace(/[-\s]/g, '')
    if (isbn.length === 13) {
      return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 9)}-${isbn.slice(9, 12)}-${isbn.slice(12)}`
    }
    if (isbn.length === 10) {
      return `${isbn.slice(0, 1)}-${isbn.slice(1, 4)}-${isbn.slice(4, 10)}`
    }
    return this.isbn
  }
}

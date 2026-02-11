import { BorrowStatus } from '@prisma/client'

export class Borrow {
  id: number
  bookId: number
  userId: number
  status: BorrowStatus
  borrowDate: Date
  dueDate: Date
  returnDate?: Date

  
  constructor(partial: Partial<Borrow>) {
    this.id = partial.id || 0
    this.bookId = partial.bookId || 0
    this.userId = partial.userId || 0
    this.status = partial.status || BorrowStatus.PENDING
    this.borrowDate = partial.borrowDate || new Date()
    this.dueDate = partial.dueDate || new Date()
    this.returnDate = partial.returnDate || undefined
  }
}

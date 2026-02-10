import {ReservationStatus} from '@prisma/client'
export class BookReservation {
  id: number
  bookId: number
  userId: number
  status: ReservationStatus
  borrowDate: Date
  dueDate: Date
  returnDate: Date

  constructor(partial: Partial<BookReservation>) {
    this.id = partial.id || 0
    this.bookId = partial.bookId || 0
    this.userId = partial.userId || 0
    this.status = partial.status || ReservationStatus.PENDING
    this.borrowDate = partial.borrowDate || new Date()
    this.dueDate = partial.dueDate || new Date()
    this.returnDate = partial.returnDate || new Date()
  }
}

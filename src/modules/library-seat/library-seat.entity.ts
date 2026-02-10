import { SeatStatus } from '@prisma/client'

export class LibrarySeat {
  id: number
  seatNumber: string
  location: string
  status: SeatStatus

  constructor(data: Partial<LibrarySeat>) {
    this.id = data.id || 0
    this.seatNumber = data.seatNumber || ''
    this.location = data.location || ''
    this.status = data.status || SeatStatus.AVAILABLE
  }
}

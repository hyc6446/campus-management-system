import { ReservationStatus } from '@prisma/client'

export class SeatReservation {
  id: number
  seatId: number
  userId: number
  status: ReservationStatus
  reserveDate: Date
  startTime: Date
  endTime: Date

  constructor(data: Partial<SeatReservation>) {
    this.id = data.id || 0
    this.userId = data.userId || 0
    this.seatId = data.seatId || 0
    this.startTime = data.startTime || new Date()
    this.endTime = data.endTime || new Date()
    this.status = data.status || ReservationStatus.PENDING
    this.reserveDate = data.reserveDate || new Date()
  }
}

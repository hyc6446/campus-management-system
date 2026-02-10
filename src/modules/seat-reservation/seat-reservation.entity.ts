import { ReservationStatus } from "@prisma/client"

export class SeatReservation {
  id: number
  userId: number
  seatId: number
  startTime: Date
  endTime: Date
  status: ReservationStatus

  constructor(data: Partial<SeatReservation>) {
    this.id = data.id || 0
    this.userId = data.userId || 0
    this.seatId = data.seatId || 0
    this.startTime = data.startTime || new Date()
    this.endTime = data.endTime || new Date()
    this.status = data.status || ReservationStatus.PENDING
  }
}

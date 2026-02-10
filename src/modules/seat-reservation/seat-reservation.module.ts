import { Module } from '@nestjs/common'
import { SeatReservationController } from './seat-reservation.controller'
import { SeatReservationService } from './seat-reservation.service'
import { SeatReservationRepository } from './seat-reservation.repository'
import { AuthCoreModule } from '@core/auth/auth.module'

@Module({
  imports: [AuthCoreModule],
  controllers: [SeatReservationController],
  providers: [SeatReservationService, SeatReservationRepository],
  exports: [SeatReservationService], 
})
export class SeatReservationModule {}

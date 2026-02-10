import { Module } from '@nestjs/common'
import { BookReservationController } from './book-reservation.controller'
import { BookReservationService } from './book-reservation.service'
import { BookReservationRepository } from './book-reservation.repository'
import { AuthCoreModule } from '@core/auth/auth.module'
import { BookModule } from '@app/modules/book/book.module'

@Module({
  imports: [AuthCoreModule, BookModule],
  controllers: [BookReservationController],
  providers: [BookReservationService, BookReservationRepository],
  exports: [BookReservationService],
})
export class BookReservationModule {}

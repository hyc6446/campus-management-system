import { Module } from '@nestjs/common'
import { LibrarySeatController } from './library-seat.controller'
import { LibrarySeatService } from './library-seat.service'
import { LibrarySeatRepository } from './library-seat.repository'
import { AuthCoreModule } from '@core/auth/auth.module'

@Module({
  imports: [AuthCoreModule],
  controllers: [LibrarySeatController],
  providers: [LibrarySeatService, LibrarySeatRepository],
  exports: [LibrarySeatService],
})
export class LibrarySeatModule {}

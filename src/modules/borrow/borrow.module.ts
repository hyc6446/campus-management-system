import { Module } from '@nestjs/common'
import { BorrowController } from './borrow.controller'
import { BorrowService } from './borrow.service'
import { BorrowRepository } from './borrow.repository'
import { AuthCoreModule } from '@core/auth/auth.module'
import { BookModule } from '@app/modules/book/book.module'

@Module({
  imports: [AuthCoreModule, BookModule],
  controllers: [BorrowController],
  providers: [BorrowService, BorrowRepository],
  exports: [BorrowService],
})
export class BorrowModule {}

import { Module } from '@nestjs/common'
import { ClassController } from './class.controller'
import { ClassService } from './class.service'
import { ClassRepository } from './class.repository'
import { AuthCoreModule } from '@core/auth/auth.module'

@Module({
  imports: [AuthCoreModule],
  controllers: [ClassController],
  providers: [ClassService, ClassRepository],
  exports: [ClassService],
})
export class ClassModule {}

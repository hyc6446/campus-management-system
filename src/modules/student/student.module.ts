import { Module } from '@nestjs/common'
import { StudentController } from './student.controller'
import { StudentService } from './student.service'
import { StudentRepository } from './student.repository'
import { AuthCoreModule } from '@core/auth/auth.module'

@Module({
  imports: [AuthCoreModule],
  controllers: [StudentController],
  providers: [StudentService, StudentRepository],
  exports: [StudentService],
})
export class StudentModule {}

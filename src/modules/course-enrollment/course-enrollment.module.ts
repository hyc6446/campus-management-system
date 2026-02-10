import { Module } from '@nestjs/common'
import { CourseEnrollmentController } from './course-enrollment.controller'
import { CourseEnrollmentService } from './course-enrollment.service'
import { CourseEnrollmentRepository } from './course-enrollment.repository'
import { AuthCoreModule } from '@core/auth/auth.module'

@Module({
  imports: [AuthCoreModule],
  controllers: [CourseEnrollmentController],
  providers: [CourseEnrollmentService, CourseEnrollmentRepository],
  exports: [CourseEnrollmentService],
})
export class CourseEnrollmentModule {}

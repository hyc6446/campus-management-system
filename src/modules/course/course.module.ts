import { Module } from '@nestjs/common'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { CourseRepository } from './course.repository'
import { AuthCoreModule } from '@core/auth/auth.module'

@Module({
  imports: [AuthCoreModule],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  exports: [CourseService],
})
export class CourseModule {}

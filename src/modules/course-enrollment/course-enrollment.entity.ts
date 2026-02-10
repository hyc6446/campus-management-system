import { EnrollmentStatus } from '@prisma/client'

export class CourseEnrollment {
  id: number
  courseId: number
  userId: number
  teachingId: number
  status: EnrollmentStatus

  constructor(data: Partial<CourseEnrollment>) {
    this.id = data.id || 0
    this.courseId = data.courseId || 0
    this.userId = data.userId || 0
    this.teachingId = data.teachingId || 0
    this.status = data.status || EnrollmentStatus.ACTIVE
  }
}

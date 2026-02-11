import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/course-enrollment/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class CourseEnrollmentRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取课程订阅列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 课程订阅列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.CourseEnrollmentWhereInput,
    orderBy: Prisma.CourseEnrollmentOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_COURSE_ENROLLMENT_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.courseEnrollment.findMany({
        where,
        skip,
        take,
        orderBy,
        select: pt.DEFAULT_COURSE_ENROLLMENT_FIELDS,
      }),
      this.prisma.courseEnrollment.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取课程订阅（可选）
   * @param id 课程订阅ID
   * @returns 课程订阅详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_COURSE_ENROLLMENT_TYPE | null> {
    return this.prisma.courseEnrollment.findUnique({
      where: { id, deletedAt: null },
      select: pt.DEFAULT_COURSE_ENROLLMENT_FIELDS,
    })
  }
  async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_COURSE_ENROLLMENT_TYPE | null> {
    return this.prisma.courseEnrollment.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_COURSE_ENROLLMENT_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_COURSE_ENROLLMENT_TYPE | null> {
    return this.prisma.courseEnrollment.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_COURSE_ENROLLMENT_FIELDS,
    })
  }
  /**
   * 根据课程ID、用户ID、教师ID获取课程订阅（可选）
   * @param courseId 课程ID
   * @param userId 用户ID
   * @param teachingId 教师ID
   * @returns 课程订阅详情或null
   */
  async findByUniqueOptional(
    courseId: number,
    userId: number,
    teachingId: number
  ): Promise<pt.DEFAULT_COURSE_ENROLLMENT_TYPE | null> {
    return this.prisma.courseEnrollment.findUnique({
      where: { course_user_teaching_unique: { courseId, userId, teachingId } },
      select: pt.DEFAULT_COURSE_ENROLLMENT_FIELDS,
    })
  }
  async findByNameOptionalWithSafe(
    courseId: number,
    userId: number,
    teachingId: number
  ): Promise<pt.SAFE_COURSE_ENROLLMENT_TYPE | null> {
    return this.prisma.courseEnrollment.findUnique({
      where: { course_user_teaching_unique: { courseId, userId, teachingId } },
      select: pt.SAFE_COURSE_ENROLLMENT_FIELDS,
    })
  }
  async findByNameOptionalWithFull(
    courseId: number,
    userId: number,
    teachingId: number
  ): Promise<pt.FULL_COURSE_ENROLLMENT_TYPE | null> {
    return this.prisma.courseEnrollment.findUnique({
      where: { course_user_teaching_unique: { courseId, userId, teachingId } },
      select: pt.FULL_COURSE_ENROLLMENT_FIELDS,
    })
  }
  /**
   * 创建新课程订阅
   * @param data 课程订阅数据
   * @returns 创建的课程订阅
   */
  async create(data: CreateDto): Promise<pt.DEFAULT_COURSE_ENROLLMENT_TYPE> {
    return this.prisma.courseEnrollment.create({
      data,
      select: pt.DEFAULT_COURSE_ENROLLMENT_FIELDS,
    })
  }

  /**
   * 更新课程订阅
   * @param id 课程订阅ID
   * @param data 更新数据
   * @returns 更新后的课程订阅
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_COURSE_ENROLLMENT_TYPE> {
    return this.prisma.courseEnrollment.update({
      where: { id },
      data,
      select: pt.DEFAULT_COURSE_ENROLLMENT_FIELDS,
    })
  }

  /**
   * 删除课程订阅（软删除）
   * @param id 课程订阅ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const data = await this.prisma.courseEnrollment.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return data !== null
  }

  /**
   * 恢复已删除课程订阅
   * @param id 课程订阅ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const data = await this.prisma.courseEnrollment.update({
      where: { id },
      data: { deletedAt: null },
    })
    return data !== null
  }
}

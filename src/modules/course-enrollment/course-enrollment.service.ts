import { Injectable, HttpStatus } from '@nestjs/common'
import { CourseEnrollmentRepository } from '@app/modules/course-enrollment/course-enrollment.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/course-enrollment/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class CourseEnrollmentService {
  constructor(private courseEnrollmentRepository: CourseEnrollmentRepository) {}

  /**
   * 获取课程列表（分页）
   * @param query 查询参数
   * @returns 课程列表和总数
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_COURSE_ENROLLMENT_TYPE>> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      courseId,
      userId,
      createdAt,
    } = query
    const skip = (page - 1) * take
    const where: Prisma.CourseEnrollmentWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (courseId) where.courseId = courseId
    if (userId) where.userId = userId
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.CourseEnrollmentOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.courseEnrollmentRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取课程订阅
   * @param id 课程订阅ID
   * @returns 课程订阅详情
   */
  async findById(id: number): Promise<pt.DEFAULT_COURSE_ENROLLMENT_TYPE> {
    const data = await this.courseEnrollmentRepository.findByIdOptional(id)
    if (!data)
      throw new AppException('课程订阅不存在', 'CourseEnrollment_No_Found', HttpStatus.NOT_FOUND)
    return data
  }

  /**
   * 根据ID获取课程订阅（可选）
   * @param id 课程订阅ID
   * @returns 课程订阅详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_COURSE_ENROLLMENT_TYPE | null> {
    return await this.courseEnrollmentRepository.findByIdOptional(id)
  }

  /**
   * 创建新课程订阅
   * @param data 课程订阅数据
   * @returns 创建的课程订阅
   */
  async create(data: CreateDto): Promise<pt.DEFAULT_COURSE_ENROLLMENT_TYPE> {
    const existingCourse = await this.courseEnrollmentRepository.findByUniqueOptional(
      data.courseId,
      data.userId,
      data.teachingId
    )
    if (existingCourse)
      throw new AppException('课程订阅已存在', 'CourseEnrollment_Exist', HttpStatus.BAD_REQUEST)
    return this.courseEnrollmentRepository.create(data)
  }

  /**
   * 更新课程订阅
   * @param id 课程订阅ID
   * @param data 更新数据
   * @returns 更新后的课程订阅
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_COURSE_ENROLLMENT_TYPE> {
    // 检查课程订阅是否存在
    const updatedata = await this.courseEnrollmentRepository.findByIdOptionalWithFull(id)
    if (!updatedata)
      throw new AppException('课程订阅不存在', 'CourseEnrollment_No_Found', HttpStatus.NOT_FOUND)
    // 检查课程订阅是否已删除
    if (updatedata.deletedAt)
      throw new AppException('该数据已废弃', 'CourseEnrollment_Deleted', HttpStatus.BAD_REQUEST)
    return this.courseEnrollmentRepository.update(id, data)
  }

  /**
   * 删除课程订阅（软删除）
   * @param id 课程订阅ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    // 检查课程订阅是否存在
    const coursedata = await this.courseEnrollmentRepository.findByIdOptionalWithFull(id)
    if (!coursedata)
      throw new AppException('课程订阅不存在', 'CourseEnrollment_No_Found', HttpStatus.NOT_FOUND)
    // 检查课程订阅是否已删除
    if (coursedata.deletedAt)
      throw new AppException('该数据已废弃', 'CourseEnrollment_Deleted', HttpStatus.BAD_REQUEST)
    return this.courseEnrollmentRepository.delete(id)
  }

  /**
   * 恢复已删除课程订阅
   * @param id 课程订阅ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    // 检查课程订阅是否存在
    const coursedata = await this.courseEnrollmentRepository.findByIdOptionalWithFull(id)
    if (!coursedata)
      throw new AppException('课程订阅不存在', 'CourseEnrollment_No_Found', HttpStatus.NOT_FOUND)
    // 检查课程订阅是否已删除
    if (!coursedata.deletedAt)
      throw new AppException('该数据未废弃', 'CourseEnrollment_Not_Deleted', HttpStatus.BAD_REQUEST)
    return this.courseEnrollmentRepository.restore(id)
  }
}

import { Injectable, HttpStatus } from '@nestjs/common'
import { CourseRepository } from '@app/modules/course/course.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/course/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  /**
   * 获取课程列表（分页）
   * @param query 查询参数
   * @returns 课程列表和总数
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_COURSE_TYPE>> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      name,
      createdAt,
    } = query
    const skip = (page - 1) * take
    const where: Prisma.CourseWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (name) where.name = { contains: name }
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.CourseOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.courseRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取课程
   * @param id 课程ID
   * @returns 课程详情
   */
  async findById(id: number): Promise<pt.DEFAULT_COURSE_TYPE> {
    const data = await this.courseRepository.findByIdOptional(id)
    if (!data) throw new AppException('课程不存在', 'Course_No_Found', HttpStatus.NOT_FOUND)
    return data
  }

  /**
   * 根据ID获取课程（可选）
   * @param id 课程ID
   * @returns 课程详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_COURSE_TYPE | null> {
    return await this.courseRepository.findByIdOptional(id)
  }

  /**
   * 创建新课程
   * @param data 课程数据
   * @returns 创建的课程
   */
  async create(data: CreateDto): Promise<pt.DEFAULT_COURSE_TYPE> {
    const existingCourse = await this.courseRepository.findByNameOptional(data.name)
    if (existingCourse) throw new AppException('课程已存在', 'Course_Exist', HttpStatus.BAD_REQUEST)
    return this.courseRepository.create(data)
  }

  /**
   * 更新课程
   * @param id 课程ID
   * @param data 更新数据
   * @returns 更新后的课程
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_COURSE_TYPE> {
    // 检查课程是否存在
    const updatedata = await this.courseRepository.findByIdOptionalWithFull(id)
    if (!updatedata) throw new AppException('课程不存在', 'Course_No_Found', HttpStatus.NOT_FOUND)
    // 检查课程是否已删除
    if (updatedata.deletedAt)
      throw new AppException('该数据已废弃', 'Course_Deleted', HttpStatus.BAD_REQUEST)
    return this.courseRepository.update(id, data)
  }

  /**
   * 删除课程（软删除）
   * @param id 课程ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    // 检查课程是否存在
    const coursedata = await this.courseRepository.findByIdOptionalWithFull(id)
    if (!coursedata) throw new AppException('课程不存在', 'Course_No_Found', HttpStatus.NOT_FOUND)
    // 检查课程是否已删除
    if (coursedata.deletedAt)
      throw new AppException('该数据已废弃', 'Course_Deleted', HttpStatus.BAD_REQUEST)
    return this.courseRepository.delete(id)
  }

  /**
   * 恢复已删除课程
   * @param id 课程ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    // 检查课程是否存在
    const coursedata = await this.courseRepository.findByIdOptionalWithFull(id)
    if (!coursedata) throw new AppException('课程不存在', 'Course_No_Found', HttpStatus.NOT_FOUND)
    // 检查课程是否已删除
    if (!coursedata.deletedAt)
      throw new AppException('该数据未废弃', 'Course_Not_Deleted', HttpStatus.BAD_REQUEST)
    return this.courseRepository.restore(id)
  }
}

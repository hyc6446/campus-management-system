import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/course/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class CourseRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取课程列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 课程列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.CourseWhereInput,
    orderBy: Prisma.CourseOrderByWithRelationInput
  ): Promise<{ data: pt.SAFE_COURSE_TYPE[]; total: number; page: number; take: number }> {
    const [data, total] = await Promise.all([
      this.prisma.course.findMany({ where, skip, take, orderBy, select: pt.SAFE_COURSE_FIELDS }),
      this.prisma.course.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取课程（可选）
   * @param id 课程ID
   * @returns 课程详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_COURSE_TYPE | null> {
    return this.prisma.course.findUnique({
      where: { id, deletedAt: null },
      select: pt.DEFAULT_COURSE_FIELDS,
    })
  }
  async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_COURSE_TYPE | null> {
    return this.prisma.course.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_COURSE_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_COURSE_TYPE | null> {
    return this.prisma.course.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_COURSE_FIELDS,
    })
  }
  /**
   * 根据名称获取课程（可选）
   * @param name 课程名称
   * @returns 课程详情或null
   */
  async findByNameOptional(name: string): Promise<pt.DEFAULT_COURSE_TYPE | null> {
    return this.prisma.course.findUnique({
      where: { name, deletedAt: null },
      select: pt.DEFAULT_COURSE_FIELDS,
    })
  }
  async findByNameOptionalWithSafe(name: string): Promise<pt.SAFE_COURSE_TYPE | null> {
    return this.prisma.course.findUnique({
      where: { name, deletedAt: null },
      select: pt.SAFE_COURSE_FIELDS,
    })
  }
  async findByNameOptionalWithFull(name: string): Promise<pt.FULL_COURSE_TYPE | null> {
    return this.prisma.course.findUnique({
      where: { name, deletedAt: null },
      select: pt.FULL_COURSE_FIELDS,    
    })
  }
  /**
   * 创建新课程
   * @param data 课程数据
   * @returns 创建的课程
   */
  async create(data: CreateDto): Promise<pt.SAFE_COURSE_TYPE> {
    return this.prisma.course.create({
      data,
      select: pt.SAFE_COURSE_FIELDS,
    })
  }

  /**
   * 更新课程
   * @param id 课程ID
   * @param data 更新数据
   * @returns 更新后的课程
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_COURSE_TYPE> {
    return this.prisma.course.update({
      where: { id },
      data,
      select: pt.SAFE_COURSE_FIELDS,
    })
  }

  /**
   * 删除课程（软删除）
   * @param id 课程ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const deletedCourse = await this.prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: pt.SAFE_COURSE_FIELDS,
    })
    return deletedCourse !== null
  }

  /**
   * 恢复已删除课程
   * @param id 课程ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const restoredCourse = await this.prisma.course.update({
      where: { id },
      data: { deletedAt: null },
    })
    return restoredCourse !== null
  }
}

import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/student/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class StudentRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取学生列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 学生列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.StudentWhereInput,
    orderBy: Prisma.StudentOrderByWithRelationInput
  ): Promise<{ data: pt.SAFE_STUDENT_TYPE[]; total: number; page: number; take: number }> {
    const [data, total] = await Promise.all([
      this.prisma.student.findMany({ where, skip, take, orderBy, select: pt.SAFE_STUDENT_FIELDS }),
      this.prisma.student.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取学生（可选）
   * @param id 学生ID
   * @returns 学生详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_STUDENT_TYPE | null> {
    return this.prisma.student.findUnique({
      where: { id, deletedAt: null },
      select: pt.DEFAULT_STUDENT_FIELDS,
    })
  }
  async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_STUDENT_TYPE | null> {
    return this.prisma.student.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_STUDENT_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_STUDENT_TYPE | null> {
    return this.prisma.student.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_STUDENT_FIELDS,
    })
  }
  /**
   * 根据名称获取学生（可选）
   * @param name 学生名称
   * @returns 学生详情或null  
   */
  // async findByNameOptional(name: string): Promise<pt.DEFAULT_STUDENT_TYPE | null> {
  //   return this.prisma.student.findUnique({
  //     where: { name, deletedAt: null },
  //     select: pt.DEFAULT_STUDENT_FIELDS,
  //   })
  // }
  // async findByNameOptionalWithSafe(name: string): Promise<pt.SAFE_STUDENT_TYPE | null> {
  //   return this.prisma.student.findUnique({
  //     where: { name, deletedAt: null },
  //     select: pt.SAFE_STUDENT_FIELDS,
  //   })
  // }
  // async findByNameOptionalWithFull(name: string): Promise<pt.FULL_STUDENT_TYPE | null> {
  //   return this.prisma.student.findUnique({
  //     where: { name, deletedAt: null },
  //     select: pt.FULL_STUDENT_FIELDS,    
  //   })
  // }
  /**
   * 创建新课程
   * @param data 课程数据
   * @returns 创建的课程
   */
  async create(data: CreateDto): Promise<pt.SAFE_STUDENT_TYPE> {
    return this.prisma.student.create({
      data,
      select: pt.SAFE_STUDENT_FIELDS,
    })
  }

  /**
   * 更新学生
   * @param id 学生ID
   * @param data 更新数据
   * @returns 更新后的学生
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_STUDENT_TYPE> {
    return this.prisma.student.update({
      where: { id },
      data,
      select: pt.SAFE_STUDENT_FIELDS,
    })
  }

  /**
   * 删除学生（软删除）
   * @param id 学生ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const deletedStudent = await this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: pt.SAFE_STUDENT_FIELDS,
    })
    return deletedStudent !== null
  }

  /**
   * 恢复已删除学生
   * @param id 学生ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const restoredStudent = await this.prisma.student.update({
      where: { id },
      data: { deletedAt: null },
      select: pt.SAFE_STUDENT_FIELDS,
    })
    return restoredStudent !== null
  }
}

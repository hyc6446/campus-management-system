import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/class/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class ClassRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取班级列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 班级列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.ClassWhereInput,
    orderBy: Prisma.ClassOrderByWithRelationInput
  ): Promise<{ data: pt.SAFE_CLASS_TYPE[]; total: number; page: number; take: number }> {
    const [data, total] = await Promise.all([
      this.prisma.class.findMany({ where, skip, take, orderBy, select: pt.SAFE_CLASS_FIELDS }),
      this.prisma.class.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取班级（可选）
   * @param id 班级ID
   * @returns 班级详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_CLASS_TYPE | null> {
    return this.prisma.class.findUnique({
      where: { id, deletedAt: null },
      select: pt.DEFAULT_CLASS_FIELDS,
    })
  }
  async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_CLASS_TYPE | null> {
    return this.prisma.class.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_CLASS_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_CLASS_TYPE | null> {
    return this.prisma.class.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_CLASS_FIELDS,
    })
  }
  /**
   * 根据名称获取班级（可选）
   * @param name 班级名称
   * @returns 班级详情或null
   */
  async findByNameOptional(name: string): Promise<pt.DEFAULT_CLASS_TYPE | null> {
    return this.prisma.class.findUnique({
      where: { name, deletedAt: null },
      select: pt.DEFAULT_CLASS_FIELDS,
    })
  }
  async findByNameOptionalWithSafe(name: string): Promise<pt.SAFE_CLASS_TYPE | null> {
    return this.prisma.class.findUnique({
      where: { name, deletedAt: null },
      select: pt.SAFE_CLASS_FIELDS,
    })
  }
  async findByNameOptionalWithFull(name: string): Promise<pt.FULL_CLASS_TYPE | null> {
    return this.prisma.class.findUnique({
      where: { name, deletedAt: null },
      select: pt.FULL_CLASS_FIELDS,
    })
  }
  /**
   * 创建新班级
   * @param data 班级数据
   * @returns 创建的班级
   */
  async create(data: CreateDto): Promise<pt.SAFE_CLASS_TYPE> {
    return this.prisma.class.create({
      data,
      select: pt.SAFE_CLASS_FIELDS,
    })
  }

  /**
   * 更新班级
   * @param id 班级ID
   * @param data 更新数据
   * @returns 更新后的班级
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_CLASS_TYPE> {
    return this.prisma.class.update({
      where: { id },
      data,
      select: pt.SAFE_CLASS_FIELDS,
    })
  }

  /**
   * 删除班级（软删除）
   * @param id 班级ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const deletedClass = await this.prisma.class.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: pt.SAFE_CLASS_FIELDS,
    })
    return deletedClass !== null
  }

  /**
   * 恢复已删除班级
   * @param id 班级ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const restoredClass = await this.prisma.class.update({
      where: { id },
      data: { deletedAt: null },
    })
    return restoredClass !== null
  }
}

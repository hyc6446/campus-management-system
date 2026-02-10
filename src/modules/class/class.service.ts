import { Injectable, HttpStatus } from '@nestjs/common'
import { ClassRepository } from '@app/modules/class/class.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/class/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class ClassService {
  constructor(private classRepository: ClassRepository) {}

  /**
   * 获取班级列表（分页）
   * @param query 查询参数
   * @returns 班级列表和总数
   */
  async findAll(
    query: QueryDto
  ): Promise<pt.QUERY_LIST_TYPE<pt.SAFE_CLASS_TYPE>> {
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
    const where: Prisma.ClassWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (name) where.name = { contains: name }
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.ClassOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.classRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取班级
   * @param id 班级ID
   * @returns 班级详情
   */
  async findById(id: number): Promise<pt.DEFAULT_CLASS_TYPE> {
    const data = await this.classRepository.findByIdOptional(id)
    if (!data) throw new AppException('班级不存在', 'Class_No_Found', HttpStatus.NOT_FOUND)
    return data
  }

  /**
   * 根据ID获取班级（可选）
   * @param id 班级ID
   * @returns 班级详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_CLASS_TYPE | null> {
    return await this.classRepository.findByIdOptional(id)
  }

  /**
   * 创建新班级
   * @param data 班级数据
   * @returns 创建的班级
   */
  async create(data: CreateDto): Promise<pt.SAFE_CLASS_TYPE> {
    const existingClass = await this.classRepository.findByNameOptional(data.name)
    if (existingClass) throw new AppException('班级已存在', 'Class_Exist', HttpStatus.BAD_REQUEST)
    return this.classRepository.create(data)
  }

  /**
   * 更新班级
   * @param id 班级ID
   * @param data 更新数据
   * @returns 更新后的班级
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_CLASS_TYPE> {
    // 检查班级是否存在
    const updatedata = await this.classRepository.findByIdOptionalWithFull(id)
    if (!updatedata) throw new AppException('班级不存在', 'Class_No_Found', HttpStatus.NOT_FOUND)
    // 检查班级是否已删除
    if (updatedata.deletedAt)
      throw new AppException('该数据已废弃', 'Class_Deleted', HttpStatus.BAD_REQUEST)
    return this.classRepository.update(id, data)
  }

  /**
   * 删除班级（软删除）
   * @param id 班级ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    // 检查班级是否存在
    const classdata = await this.classRepository.findByIdOptionalWithFull(id)
    if (!classdata) throw new AppException('班级不存在', 'Class_No_Found', HttpStatus.NOT_FOUND)
    // 检查班级是否已删除
    if (classdata.deletedAt)
      throw new AppException('该数据已废弃', 'Class_Deleted', HttpStatus.BAD_REQUEST)
    return this.classRepository.delete(id)
  }

  /**
   * 恢复已删除班级
   * @param id 班级ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    // 检查班级是否存在
    const classdata = await this.classRepository.findByIdOptionalWithFull(id)
    if (!classdata) throw new AppException('班级不存在', 'Class_No_Found', HttpStatus.NOT_FOUND)
    // 检查班级是否已删除
    if (!classdata.deletedAt)
      throw new AppException('该数据未废弃', 'Class_Not_Deleted', HttpStatus.BAD_REQUEST)
    return this.classRepository.restore(id)
  }
}

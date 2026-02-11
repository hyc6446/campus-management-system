import { Injectable, HttpStatus } from '@nestjs/common'
import { StudentRepository } from '@app/modules/student/student.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/student/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class StudentService {
  constructor(private studentRepository: StudentRepository) {}

  /**
   * 获取学生列表（分页）
   * @param query 查询参数
   * @returns 学生列表和总数
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_STUDENT_TYPE>> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      name,
      createdAt,
    } = query
    if (take > 100) {
      throw new AppException('每页数量不能超过100', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST)
    }
    const skip = (page - 1) * take
    const where: Prisma.StudentWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (name) where.name = { contains: name }
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.StudentOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.studentRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取学生
   * @param id 学生ID
   * @returns 学生详情
   */
  async findById(id: number): Promise<pt.DEFAULT_STUDENT_TYPE> {
    const data = await this.studentRepository.findByIdOptional(id)
    if (!data) throw new AppException('学生不存在', 'Student_No_Found', HttpStatus.NOT_FOUND)
    return data
  }

  /**
   * 根据ID获取学生（可选）
   * @param id 学生ID
   * @returns 学生详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_STUDENT_TYPE | null> {
    return await this.studentRepository.findByIdOptional(id)
  }

  /**
   * 创建新学生
   * @param data 学生数据
   * @returns 创建的学生
   */
  async create(data: CreateDto): Promise<pt.DEFAULT_STUDENT_TYPE> {
    // const existingStudent = await this.studentRepository.findByNameOptional(data.name)
    // if (existingStudent) throw new AppException('学生已存在', 'Student_Exist', HttpStatus.BAD_REQUEST)
    return this.studentRepository.create(data)
  }

  /**
   * 更新学生
   * @param id 学生ID
   * @param data 更新数据
   * @returns 更新后的学生
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_STUDENT_TYPE> {
    // 检查学生是否存在
    const updatedata = await this.studentRepository.findByIdOptionalWithFull(id)
    if (!updatedata) throw new AppException('学生不存在', 'Student_No_Found', HttpStatus.NOT_FOUND)
    // 检查学生是否已删除
    if (updatedata.deletedAt)
      throw new AppException('该数据已废弃', 'Student_Deleted', HttpStatus.BAD_REQUEST)
    return this.studentRepository.update(id, data)
  }

  /**
   * 删除学生（软删除）
   * @param id 学生ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    // 检查学生是否存在
    const data = await this.studentRepository.findByIdOptionalWithFull(id)
    if (!data) throw new AppException('学生不存在', 'Student_No_Found', HttpStatus.NOT_FOUND)
    // 检查学生是否已删除
    if (data.deletedAt)
      throw new AppException('该数据已废弃', 'Student_Deleted', HttpStatus.BAD_REQUEST)
    return this.studentRepository.delete(id)
  }

  /**
   * 恢复已删除学生
   * @param id 学生ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    // 检查学生是否存在
    const data = await this.studentRepository.findByIdOptionalWithFull(id)
    if (!data) throw new AppException('学生不存在', 'Student_No_Found', HttpStatus.NOT_FOUND)
    // 检查学生是否已删除
    if (!data.deletedAt)
      throw new AppException('该数据未废弃', 'Student_Not_Deleted', HttpStatus.BAD_REQUEST)
    return this.studentRepository.restore(id)
  }
}

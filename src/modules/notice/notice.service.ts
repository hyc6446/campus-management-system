import { Injectable, HttpStatus } from '@nestjs/common'
import { NoticeRepository } from '@app/modules/notice/notice.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/notice/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class NoticeService {
  constructor(private noticeRepository: NoticeRepository) {}

  /**
   * 获取公告列表（分页）
   * @param query 查询参数
   * @returns 公告列表和总数
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.SAFE_NOTICE_TYPE>> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      title,
      createdAt,
    } = query
    const skip = (page - 1) * take
    const where: Prisma.SystemNoticeWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (title) where.title = { contains: title }
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.SystemNoticeOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.noticeRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 根据ID获取公告
   * @param id 公告ID
   * @returns 公告详情
   */
  async findById(id: number): Promise<pt.DEFAULT_NOTICE_TYPE> {
    const data = await this.noticeRepository.findByIdOptional(id)
    if (!data) throw new AppException('公告不存在', 'Notice_No_Found', HttpStatus.NOT_FOUND)
    return data
  }

  /**
   * 根据ID获取公告（可选）
   * @param id 公告ID
   * @returns 公告详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_NOTICE_TYPE | null> {
    return await this.noticeRepository.findByIdOptional(id)
  }

  /**
   * 创建新公告
   * @param data 公告数据
   * @returns 创建的公告
   */
  async create(data: CreateDto): Promise<pt.SAFE_NOTICE_TYPE> {
    const existingNotice = await this.noticeRepository.findByNameOptional(data.title)
    if (existingNotice) throw new AppException('公告已存在', 'Notice_Exist', HttpStatus.BAD_REQUEST)
    return this.noticeRepository.create(data)
  }

  /**
   * 更新公告
   * @param id 公告ID
   * @param data 更新数据
   * @returns 更新后的公告
   */
  async update(id: number, data: UpdateDto): Promise<pt.SAFE_NOTICE_TYPE> {
    // 检查公告是否存在
    const updatedata = await this.noticeRepository.findByIdOptionalWithFull(id)
    if (!updatedata) throw new AppException('公告不存在', 'Notice_No_Found', HttpStatus.NOT_FOUND)
    // 检查公告是否已删除
    if (updatedata.deletedAt)
      throw new AppException('该数据已废弃', 'Notice_Deleted', HttpStatus.BAD_REQUEST)
    return this.noticeRepository.update(id, data)
  }

  /**
   * 删除公告（软删除）
   * @param id 公告ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    // 检查公告是否存在
    const noticeData = await this.noticeRepository.findByIdOptionalWithFull(id)
    if (!noticeData) throw new AppException('公告不存在', 'Notice_No_Found', HttpStatus.NOT_FOUND)
    // 检查公告是否已删除
    if (noticeData.deletedAt)
      throw new AppException('该数据已废弃', 'Notice_Deleted', HttpStatus.BAD_REQUEST)
    return this.noticeRepository.delete(id)
  }

  /**
   * 恢复已删除公告
   * @param id 公告ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    // 检查公告是否存在
    const noticeData = await this.noticeRepository.findByIdOptionalWithFull(id)
    if (!noticeData) throw new AppException('公告不存在', 'Notice_No_Found', HttpStatus.NOT_FOUND)
    // 检查公告是否已删除
    if (!noticeData.deletedAt)
      throw new AppException('该数据未废弃', 'Notice_Not_Deleted', HttpStatus.BAD_REQUEST)
    return this.noticeRepository.restore(id)
  }
}

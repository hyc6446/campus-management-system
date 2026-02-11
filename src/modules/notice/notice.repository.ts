import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/notice/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class NoticeRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取公告列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 公告列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.SystemNoticeWhereInput,
    orderBy: Prisma.SystemNoticeOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_NOTICE_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.systemNotice.findMany({ where, skip, take, orderBy, select: pt.DEFAULT_SYSTEM_NOTICE_FIELDS }),
      this.prisma.systemNotice.count({ where }),
    ])
    return { data, total, page, take }
  }

  /**
   * 根据ID获取公告（可选）
   * @param id 公告ID
   * @returns 公告详情或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_NOTICE_TYPE | null> {
    return this.prisma.systemNotice.findUnique({
      where: { id, deletedAt: null },
      select: pt.DEFAULT_SYSTEM_NOTICE_FIELDS,
    })
  }
  async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_NOTICE_TYPE | null> {
    return this.prisma.systemNotice.findUnique({
      where: { id, deletedAt: null },
      select: pt.SAFE_SYSTEM_NOTICE_FIELDS,
    })
  }
  async findByIdOptionalWithFull(id: number): Promise<pt.FULL_NOTICE_TYPE | null> {
    return this.prisma.systemNotice.findUnique({
      where: { id, deletedAt: null },
      select: pt.FULL_SYSTEM_NOTICE_FIELDS,
    })
  }
  /**
   * 根据标题获取公告（可选）
   * @param title 公告标题
   * @returns 公告详情或null
   */
  async findByNameOptional(title: string): Promise<pt.DEFAULT_NOTICE_TYPE[] | null> {
    return this.prisma.systemNotice.findMany({
      where: { title },
      select: pt.DEFAULT_SYSTEM_NOTICE_FIELDS,
    })
  }
  async findByNameOptionalWithSafe(title: string): Promise<pt.SAFE_NOTICE_TYPE[] | null> {
    return this.prisma.systemNotice.findMany({
      where: { title, deletedAt: null },
      select: pt.SAFE_SYSTEM_NOTICE_FIELDS,
    })
  }
  async findByNameOptionalWithFull(title: string): Promise<pt.FULL_NOTICE_TYPE[] | null> {  
    return this.prisma.systemNotice.findMany({
      where: { title, deletedAt: null },
      select: pt.FULL_SYSTEM_NOTICE_FIELDS,    
    })
  }
  /**
   * 创建新公告
   * @param data 公告数据
   * @returns 创建的公告
   */
  async create(data: CreateDto): Promise<pt.DEFAULT_NOTICE_TYPE> {
    return this.prisma.systemNotice.create({
      data,
      select: pt.DEFAULT_SYSTEM_NOTICE_FIELDS,
    })
  }

  /**
   * 更新公告
   * @param id 公告ID
   * @param data 更新数据
   * @returns 更新后的公告
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_NOTICE_TYPE> {
    return this.prisma.systemNotice.update({
      where: { id },
      data,
      select: pt.DEFAULT_SYSTEM_NOTICE_FIELDS,
    })
  }

  /**
   * 删除公告（软删除）
   * @param id 公告ID
   * @returns 是否删除成功
   */
  async delete(id: number): Promise<boolean> {
    const data = await this.prisma.systemNotice.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return data !== null
  }

  /**
   * 恢复已删除公告
   * @param id 公告ID
   * @returns 是否恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const data = await this.prisma.systemNotice.update({
      where: { id },
      data: { deletedAt: null },
    })
    return data !== null
  }
}

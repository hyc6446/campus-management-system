import { Injectable } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { Prisma, TokenType } from '@prisma/client'
import * as pt from '@app/common/prisma-types'
import { CreateDto } from './dto'

@Injectable()
export class TokenRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.TokenWhereInput,
    orderBy: Prisma.TokenOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_TOKEN_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.token.findMany({ where, skip, take, orderBy, select: pt.DEFAULT_TOKEN_FIELDS }),
      this.prisma.token.count({ where }),
    ])

    return { data, page, total, take }
  }

  /**
   * 根据ID查找Token
   * @param id Token ID
   * @returns Token对象或null
   */
  async findById(id: number): Promise<pt.DEFAULT_TOKEN_TYPE | null> {
    return await this.prisma.token.findUnique({
      where: { id },
      select: pt.DEFAULT_TOKEN_FIELDS,
    })
  }
  /**
   * 根据用户ID和Token类型查找Token
   * @param userId 用户ID
   * @param tokenType Token类型
   * @returns Token对象或null
   */
  async findByUserIdAndType(where: Prisma.TokenWhereInput): Promise<pt.DEFAULT_TOKEN_TYPE | null> {
    return await this.prisma.token.findFirst({
      where,
      select: pt.DEFAULT_TOKEN_FIELDS,
    })
  }
  /**
   * 创建新Token
   * @param tokenData Token数据
   * @param includeUser 是否包含用户信息
   * @returns 创建的Token
   */
  async create(tokenData: CreateDto): Promise<pt.DEFAULT_TOKEN_TYPE> {
    return await this.prisma.token.create({
      data: tokenData,
      select: pt.DEFAULT_TOKEN_FIELDS,
    })
  }

  /**
   * 删除Token
   * @param id Token ID
   * @returns 删除结果
   */
  async delete(id: number): Promise<boolean> {
    const data = await this.prisma.token.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return data.deletedAt !== null
  }

  /**
   * 批量删除Token
   * @param ids Token ID列表
   * @returns 删除结果
   */
  async deleteMany(ids: number[]): Promise<boolean> {
    const data = await this.prisma.token.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    })
    return data.count > 0
  }
  /**
   * 根据用户ID删除Token
   * @param id 用户ID
   * @param tokenType Token类型
   * @returns 删除结果
   */
  async deleteByUserId(id: number, tokenType: TokenType): Promise<boolean> {
    const data = await this.prisma.token.updateMany({
      where: { userId: id, type: tokenType },
      data: { deletedAt: new Date() },
    })
    return data.count > 0
  }
}

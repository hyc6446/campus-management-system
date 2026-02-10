import { Injectable, HttpStatus } from '@nestjs/common'
import { Prisma, TokenType } from '@prisma/client'
import { TokenRepository } from './token.repository'
import { QueryDto, CreateDto } from './dto'
import { AppException } from '@app/common/exceptions/app.exception'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class TokenService {
  constructor(private tokenRepository: TokenRepository) {}

  /**
   * 根据ID查找Token
   * @param id Token ID
   * @returns Token对象
   * @throws NotFoundException Token不存在
   */
  async findById(id: number): Promise<pt.DEFAULT_TOKEN_TYPE> {
    const token = await this.tokenRepository.findById(id)
    if (!token) {
      throw new AppException('Token不存在', 'TOKEN_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    return token
  }
  async findByIdOptional(id: number): Promise<pt.DEFAULT_TOKEN_TYPE | null> {
    return await this.tokenRepository.findById(id)
  }
  /**
   * 根据用户ID和类型查找Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns Token对象
   * @throws NotFoundException Token不存在
   */
  async findByUserIdAndType(
    userId: number,
    type: TokenType
  ): Promise<pt.DEFAULT_TOKEN_TYPE | null> {
    const where: Prisma.TokenWhereInput = { userId, type, deletedAt: null }
    return await this.tokenRepository.findByUserIdAndType(where)
  }
  /**
   * 创建新Token
   * @param tokenData Token数据
   * @returns 创建的Token
   */
  async create(tokenData: CreateDto): Promise<pt.DEFAULT_TOKEN_TYPE> {
    return this.tokenRepository.create(tokenData)
  }

  /**
   * 获取Token列表
   * @param query 查询参数
   * @returns Token列表
   */
  async findAll(query: QueryDto) {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createAt',
      order = 'desc',
      id,
      userId,
      type,
      deletedAt,
    } = query

    const skip = (page - 1) * take
    if (take > 100) {
      throw new AppException('每页数量不能超过100', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST, {
        take,
      })
    }
    const where: Prisma.TokenWhereInput = {}
    if (id) where.id = id
    if (userId) where.userId = userId
    if (type) where.type = type
    where.deletedAt = Boolean(deletedAt) ? null : { not: null }
    const orderBy: Prisma.TokenOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }

    return this.tokenRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 删除Token
   * @param id Token ID
   * @returns 删除结果
   */
  async delete(id: number): Promise<boolean> {
    // 先检查Token是否存在
    const token = await this.findById(id)
    if (!token) {
      throw new AppException('令牌不存在', 'TOKEN_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    // 使用软删除替代物理删除
    return await this.tokenRepository.delete(id)
  }
  /**
   * 用户注销
   * @param userId 用户ID
   * @returns 注销结果
   */
  async logout(userId: number): Promise<boolean> {
    return await this.tokenRepository.deleteByUserId(userId, TokenType.REFRESH)
  }
  /**
   * 批量删除Token
   * @param ids Token ID列表
   * @returns 删除结果
   */
  async deleteMany(ids: string): Promise<boolean> {
    const idNumbers = ids.split(',').map(Number)
    return await this.tokenRepository.deleteMany(idNumbers)
  }
}

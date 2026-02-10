import { HttpStatus, Injectable } from '@nestjs/common'
import { RuleConfigRepository } from './rule-config.repository'
import { CreateDto, UpdateDto, QueryDto } from './dto'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class RuleConfigService {
  constructor(private readonly ruleConfigRepository: RuleConfigRepository) {}

  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_RULE_CONFIG_TYPE>> {
    // 1.检查是否具有查看的权限
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      rule,
      type,
      createdAt,
    } = query
    const skip = (page - 1) * take
    if (take > 100) {
      throw new AppException('每页数量不能超过100', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST)
    }
    const where: Prisma.RuleConfigWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (rule) where.rule = rule
    if (type) where.type = type
    if (createdAt) where.createdAt = { equals: new Date(createdAt) }
    const orderBy: Prisma.RuleConfigOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.ruleConfigRepository.findAll(page, take, skip, where, orderBy)
  }
  /**
   * 根据ID查找规则配置
   * @param id 规则配置ID
   * @returns 规则配置
   */
  async findById(id: number): Promise<pt.DEFAULT_RULE_CONFIG_TYPE> {
    const ruleConfig = await this.ruleConfigRepository.findById(id)
    if (!ruleConfig) {
      throw new AppException('规则配置不存在', 'RULE_CONFIG_NOT_FOUND', HttpStatus.NOT_FOUND, {
        id,
      })
    }
    return ruleConfig
  }
  /**
   * 根据ID查找规则配置（可选）
   * @param id 规则配置ID
   * @returns 规则配置或null
   */
  async findByIdOptional(id: number): Promise<pt.DEFAULT_RULE_CONFIG_TYPE | null> {
    return await this.ruleConfigRepository.findById(id)
  }

  /**
   * 根据名称查找规则配置（可选）
   * @param name 规则配置名称
   * @returns 规则配置或null
   */
  async findByNameAndType(rule: string, type: string): Promise<pt.DEFAULT_RULE_CONFIG_TYPE | null> {
    return await this.ruleConfigRepository.findByNameAndType(rule, type)
  }

  async create(data: CreateDto) {
    // 1.检查是否具有创建的权限
    // 2.检查规则配置是否存在
    return this.ruleConfigRepository.create(data)
  }

  async update(id: number, data: UpdateDto) {
    // 1.检查是否具有更新的权限
    // 2.检查规则配置是否存在
    return this.ruleConfigRepository.update(id, data)
  }

  async remove(id: number) {
    // 1.检查是否具有删除的权限
    // 2.检查规则配置是否存在
    return this.ruleConfigRepository.remove(id)
  }
}

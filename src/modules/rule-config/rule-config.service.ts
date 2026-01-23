import { HttpStatus, Injectable } from '@nestjs/common'
import { RuleConfigRepository } from './rule-config.repository'
import { CreateRuleConfigDto, UpdateRuleConfigDto, QueryRuleConfigDto } from './dto'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class RuleConfigService {
  constructor(private readonly ruleConfigRepository: RuleConfigRepository) {}

  async findAll(query: QueryRuleConfigDto) {
    // 1.检查是否具有查看的权限
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      rule,
      type,
      createdAt,
    } = query
    const skip = (page - 1) * limit
    if (limit > 100) {
      throw new AppException('每页数量不能超过100', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST, {
        limit,
      })
    }
    const where: Prisma.RuleConfigWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (rule) where.rule = rule
    if (type) where.type = type
    if (createdAt) where.createdAt = { equals: new Date(createdAt) }
    const orderBy: Prisma.RuleConfigOrderByWithRelationInput[] = []
    if (sortBy && order) {
      const sortKeys = sortBy.split(',')
      const sortOrders = order.split(',')
      sortKeys.forEach((key, index) => {
        const validOrder = sortOrders[index]
        orderBy.push({
          [key as keyof Prisma.RuleConfigOrderByWithRelationInput]: validOrder as Prisma.SortOrder,
        })
      })
    } else {
      orderBy.push({ createdAt: 'desc' })
    }
    return this.ruleConfigRepository.findAll(page, limit, skip, where, orderBy)
  }

  async findById(id: number): Promise<pt.DEFAULT_RULE_CONFIG_TYPE> {
    const ruleConfig = await this.ruleConfigRepository.findById(id)
    if (!ruleConfig) {
      throw new AppException('规则配置不存在', 'RULE_CONFIG_NOT_FOUND', HttpStatus.NOT_FOUND, {
        id,
      })
    }
    return ruleConfig
  }
  async findByIdOptional(id: number): Promise<pt.DEFAULT_RULE_CONFIG_TYPE | null> {
    return await this.ruleConfigRepository.findById(id)
  }
  // async findByIdWithSafe(id: number): Promise<pt.SAFE_RULE_CONFIG_TYPE> {}
  // async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_RULE_CONFIG_TYPE | null> {}
  // async findByIdWithFull(id: number): Promise<pt.FULL_RULE_CONFIG_TYPE> {}
  // async findByIdOptionalWithFull(id: number): Promise<pt.FULL_RULE_CONFIG_TYPE | null> {}

  async create(createRuleConfigDto: CreateRuleConfigDto) {
    // 1.检查是否具有创建的权限
    // 2.检查规则配置是否存在
    return this.ruleConfigRepository.create(createRuleConfigDto)
  }
  async update(id: number, updateRuleConfigDto: UpdateRuleConfigDto) {
    // 1.检查是否具有更新的权限
    // 2.检查规则配置是否存在
    return this.ruleConfigRepository.update(id, updateRuleConfigDto)
  }
  async remove(id: number) {
    // 1.检查是否具有删除的权限
    // 2.检查规则配置是否存在
    return this.ruleConfigRepository.remove(id)
  }
}

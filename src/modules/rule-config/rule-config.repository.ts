import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import * as dto from './dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class RuleConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page: number,
    limit: number,
    skip: number,
    where: Prisma.RuleConfigWhereInput,
    orderBy: Prisma.RuleConfigOrderByWithRelationInput[]
  ) {
    const [data, total] = await Promise.all([
      this.prisma.ruleConfig.findMany({ 
        where, 
        skip, 
        take: 
        limit, 
        orderBy,
        select: pt.DEFAULT_RULE_CONFIG_FIELDS,
       }),
      this.prisma.ruleConfig.count({ where }),
    ])

    return { data, total, page, limit }
  }

  /**
   * 通过ID查找规则配置
   * @param id 规则配置ID
   * @returns 规则配置实体或null
   */
  async findById(id: number): Promise<pt.DEFAULT_RULE_CONFIG_TYPE | null> {
    return this.prisma.ruleConfig.findUnique({
      where: { id },
      select: pt.DEFAULT_RULE_CONFIG_FIELDS,
    })
  }
  async findByIdWithSafe(id: number): Promise<pt.SAFE_RULE_CONFIG_TYPE | null> {
    return this.prisma.ruleConfig.findUnique({
      where: { id },
      select: pt.SAFE_RULE_CONFIG_FIELDS,
    })
  }
  async findByIdWithFull(id: number): Promise<pt.FULL_RULE_CONFIG_TYPE | null> {
    return this.prisma.ruleConfig.findUnique({
      where: { id },
      select: pt.FULL_RULE_CONFIG_FIELDS,
    })
  }

  /**
   * 通过action查找规则配置
   * @param action 规则名称
   * @returns 规则配置实体或null
   */
  async findByRule(rule: string): Promise<pt.DEFAULT_RULE_CONFIG_TYPE | null> {
    return this.prisma.ruleConfig.findUnique({
      where: { rule },
      select: pt.DEFAULT_RULE_CONFIG_FIELDS,
    })
  }
  async findByRuleWithSafe(rule: string): Promise<pt.SAFE_RULE_CONFIG_TYPE | null> {
    return this.prisma.ruleConfig.findUnique({
      where: { rule },
      select: pt.SAFE_RULE_CONFIG_FIELDS,
    })
  }
  async findByRuleWithFull(rule: string): Promise<pt.FULL_RULE_CONFIG_TYPE | null> {
    return this.prisma.ruleConfig.findUnique({
      where: { rule },
      select: pt.FULL_RULE_CONFIG_FIELDS,
    })
  }
  /**
   * 创建新规则配置
   * @param createRuleConfigDto 规则配置数据
   * @returns 创建的规则配置
   */
  async create(createRuleConfigDto: dto.CreateRuleConfigDto): Promise<pt.DEFAULT_RULE_CONFIG_TYPE> {
    return this.prisma.ruleConfig.create({
      data: createRuleConfigDto,
      select: pt.DEFAULT_RULE_CONFIG_FIELDS,
    })
  }
  /**
   * 更新规则配置
   * @param id 规则配置ID
   * @param updateRuleConfigDto 更新数据
   * @returns 更新后的规则配置
   */
  async update(
    id: number,
    updateRuleConfigDto: dto.UpdateRuleConfigDto
  ): Promise<pt.DEFAULT_RULE_CONFIG_TYPE> {
    return this.prisma.ruleConfig.update({
      where: { id },
      data: updateRuleConfigDto,
      select: pt.DEFAULT_RULE_CONFIG_FIELDS,
    })
  }
  /**
   * 删除规则配置
   * @param id 规则配置ID
   * @returns 删除的规则配置
   */
  async remove(id: number): Promise<pt.FULL_RULE_CONFIG_TYPE> {
    return this.prisma.ruleConfig.update({
      where: { id, },
      data:{deletedAt:new Date()},
      select: pt.FULL_RULE_CONFIG_FIELDS,
    })
  }
}

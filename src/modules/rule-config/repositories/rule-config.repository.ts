import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import * as dto from '../dto'
import * as all from '@app/common/prisma-types'

@Injectable()
export class RuleConfigRepository {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(query: dto.QueryRuleConfigDto) {
        return this.prismaService.ruleConfig.findMany()
    }
    async findOne(id: number) {
        return this.prismaService.ruleConfig.findUnique({
            where: {
                id,
            },
        })
    }
    async create(createRuleConfigDto: dto.CreateRuleConfigDto) {
        return this.prismaService.ruleConfig.create({
            data: createRuleConfigDto,
        })
    }
    async update(id: number, updateRuleConfigDto: dto.UpdateRuleConfigDto) {
        return this.prismaService.ruleConfig.update({
            where: {
                id,
            },
            data: updateRuleConfigDto,
        })
    }
    async remove(id: number) {
        return this.prismaService.ruleConfig.delete({
            where: {
                id,
            },
        })
    }
}
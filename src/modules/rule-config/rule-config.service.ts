import { Injectable, HttpStatus } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { RuleConfigRepository } from './repositories/rule-config.repository'
import * as dto from './dto'
import * as all from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'


@Injectable()
export class RuleConfigService {
    constructor(private readonly ruleConfigRepository: RuleConfigRepository) {}

    async findAll(query: dto.QueryRuleConfigDto) {
        return this.ruleConfigRepository.findAll(query)
    }
    async findOne(id: number) {
        return this.ruleConfigRepository.findOne(id)
    }
    async create(createRuleConfigDto: dto.CreateRuleConfigDto) {
        return this.ruleConfigRepository.create(createRuleConfigDto)
    }
    async update(id: number, updateRuleConfigDto: dto.UpdateRuleConfigDto) {
        return this.ruleConfigRepository.update(id, updateRuleConfigDto)
    }
    async remove(id: number) {
        return this.ruleConfigRepository.remove(id)
    }

}

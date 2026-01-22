import { AuthGuard } from '@common/guards/auth.guard'
import { RolesGuard } from '@common/guards/roles.guard'
import { ZodValidationPipe } from '@common/pipes/validation.pipe'
import { RuleConfigService } from './rule-config.service'
import { RuleConfig } from './entities/rule-config.entity'
import * as dto from './dto'
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  UsePipes,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger'

@ApiTags('casl规则配置项')
@Controller('rule-config')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class RuleConfigController {
  constructor(private readonly ruleConfigService: RuleConfigService) {}

  @ApiOperation({ summary: '查询配置项' })
  @ApiQuery({ name: 'page', description: '页码', required: false, type: Number, example: 1 })
  @ApiQuery({
    name: 'pageSize',
    description: '每页数量',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({ name: 'id', description: '配置项ID', required: false, type: Number })
  @ApiQuery({ name: 'rule', description: '规则名称', required: false, type: String })
  @ApiQuery({
    name: 'type',
    description: '规则类型项类型',
    required: false,
    type: String,
    example: 'action',
  })
  @ApiQuery({ name: 'createdAt', description: '创建时间', required: false, type: Date })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: '排序字段, 多个字段用逗号分隔',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description: '排序方式, 多个字段用逗号分隔',
    example: 'desc',
  })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功', type: RuleConfig, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '查询失败' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Get()
  async findAll(
    @Query(new ZodValidationPipe(dto.QueryRuleConfigSchema)) query: dto.QueryRuleConfigDto
  ) {
    return this.ruleConfigService.findAll(query)
  }
}

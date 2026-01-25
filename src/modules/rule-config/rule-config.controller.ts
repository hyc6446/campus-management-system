import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { RuleConfig } from '@app/modules/rule-config/rule-config.entity'
import { RoleType } from '@app/modules/role/role.entity'
import { RuleConfigService } from '@app/modules/rule-config/rule-config.service'
import { CreateRuleConfigDto, UpdateRuleConfigDto, QueryRuleConfigDto } from '@app/modules/rule-config/dto'
import { Controller, Get, Post, Body, Put, Delete, Param, Query, UseGuards, HttpStatus, ParseIntPipe, UseInterceptors } from '@nestjs/common'

@ApiTags('casl规则配置项')
@Controller('rule-config')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class RuleConfigController {
  constructor(private readonly ruleConfigService: RuleConfigService) { }

  @ApiOperation({ summary: '查询配置项列表' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功', type: RuleConfig, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '查询参数错误' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Get()
  async findAll(@Query() query: QueryRuleConfigDto) {
    return await this.ruleConfigService.findAll(query)
  }

  @ApiOperation({ summary: '查询配置项详情' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功', type: RuleConfig })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '查询参数错误' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '配置项不存在' })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.ruleConfigService.findById(id)
  }

  @ApiOperation({ summary: '创建配置项' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功', type: RuleConfig })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '查询参数错误' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '配置项不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN)
  @Post()
  async create(@Body() createRuleConfigDto: CreateRuleConfigDto) {
    return await this.ruleConfigService.create(createRuleConfigDto)
  }

  @ApiOperation({ summary: '更新配置项' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功', type: RuleConfig })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '查询参数错误' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '配置项不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRuleConfigDto: UpdateRuleConfigDto) {
    return await this.ruleConfigService.update(id, updateRuleConfigDto)
  }

  @ApiOperation({ summary: '删除配置项' })
  @ApiResponse({ status: HttpStatus.OK, description: '查询成功', type: RuleConfig })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '查询参数错误' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '配置项不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足' })
  @Roles(RoleType.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ruleConfigService.remove(id)
  }

}

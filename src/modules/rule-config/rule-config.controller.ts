import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@app/common/guards/auth.guard'
import { RolesGuard } from '@app/common/guards/roles.guard'
import { Roles } from '@app/common/decorators/roles.decorator'
import { RuleConfigService } from '@app/modules/rule-config/rule-config.service'
import {
  CreateDto,
  UpdateDto,
  QueryDto,
  ListResDto,
  ResponseDto,
} from '@app/modules/rule-config/dto'
import { ApiOk, ApiCreated, ApiResponses } from '@app/common/decorators/api-responses.decorator'

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
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common'

@ApiTags('casl规则配置项')
@Controller('rule-config')
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
@UseInterceptors(ZodSerializerInterceptor)
export class RuleConfigController {
  constructor(private readonly ruleConfigService: RuleConfigService) {}

  @ApiOperation({ summary: '查询配置项列表' })
  @ApiOk(ListResDto)
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.ruleConfigService.findAll(query)
  }

  @ApiOperation({ summary: '查询配置项详情' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true })
  @Roles(RoleType.ADMIN, RoleType.TEACHER)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.ruleConfigService.findById(id)
  }

  @ApiOperation({ summary: '创建配置项' })
  @ApiCreated(ResponseDto)
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Post()
  async create(@Body() createDto: CreateDto) {
    return await this.ruleConfigService.create(createDto)
  }

  @ApiOperation({ summary: '更新配置项' })
  @ApiOk(ResponseDto, '更新成功')
  @ApiResponses({ notFound: true, conflict: true })
  @Roles(RoleType.ADMIN)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateRuleConfigDto: UpdateDto) {
    return await this.ruleConfigService.update(id, updateRuleConfigDto)
  }

  @ApiOperation({ summary: '删除配置项' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.ruleConfigService.delete(id)
  }
}

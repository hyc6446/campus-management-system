import { RoleType } from '@prisma/client'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@common/guards/auth.guard'
import { RolesGuard } from '@common/guards/roles.guard'
import { Roles } from '@common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { TokenService } from './token.service'
import { Token } from './token.entity'
import { QueryDto, ListResDto, ResponseDto } from './dto'
import { ApiOk, ApiCreated, ApiResponses } from '@app/common/decorators/api-responses.decorator'
import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common'

@ApiTags('Token管理')
@Controller('tokens')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(ZodSerializerInterceptor)
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @ApiOperation({ summary: '获取Token列表' })
  @ApiOk(ListResDto)
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Token, action: Action.Read })
  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.tokenService.findAll(query)
  }

  @ApiOperation({ summary: '根据ID获取Token信息' })
  @ApiOk(ResponseDto)
  @ApiResponses({ notFound: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Token, action: Action.Read })
  @Get(':id')
  async getTokenById(@Param('id', ParseIntPipe) id: number) {
    return this.tokenService.findById(id)
  }

  @ApiOperation({ summary: '删除单项Token' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Token, action: Action.Delete })
  @Delete(':id')
  async deleteToken(@Param('id', ParseIntPipe) id: number) {
    return this.tokenService.delete(id)
  }

  @ApiOperation({ summary: '批量删除Token' })
  @ApiOk(ResponseDto, '停用成功')
  @ApiResponses({ notFound: true, conflict: true, gone: true })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Token, action: Action.Delete })
  @Delete('many')
  async deleteTokenMany(@Body() ids: string) {
    return this.tokenService.deleteMany(ids)
  }
}

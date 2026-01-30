import { ZodSerializerInterceptor } from 'nestjs-zod'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Action, SubjectsEnum } from '@app/core/casl/casl.types'
import { AuthGuard } from '@common/guards/auth.guard'
import { RolesGuard } from '@common/guards/roles.guard'
import { Roles } from '@common/decorators/roles.decorator'
import { Permissions } from '@app/common/decorators/permissions.decorator'
import { TokenService } from './token.service'
import { Token } from './token.entity'
import { RoleType } from '@app/modules/role/role.entity'
import * as pt from '@app/common/prisma-types'
import { QueryTokenDto } from './dto'
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
  HttpStatus,
} from '@nestjs/common'

@ApiTags('Token管理')
@Controller('tokens')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(ZodSerializerInterceptor)
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @ApiOperation({ summary: '获取Token列表' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '获取Token列表',
    type: [Token],
    isArray: true,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Token不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '没有权限访问' })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Token, action: Action.Read })
  @Get()
  async findAll(@Query() query: QueryTokenDto) {
    return this.tokenService.findAll(query)
  }

  @ApiOperation({ summary: '根据ID获取Token信息' })
  @ApiResponse({ status: HttpStatus.OK, description: '获取Token信息', type: Token })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Token不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '没有权限访问' })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Token, action: Action.Read })
  @Get(':id')
  async getTokenById(@Param('id', ParseIntPipe) id: number) {
    return this.tokenService.findById(id)
  }

  @ApiOperation({ summary: '删除单项Token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token删除成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Token不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '没有权限访问' })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Token, action: Action.Delete })
  @Delete(':id')
  async deleteToken(@Param('id', ParseIntPipe) id: number) {
    return this.tokenService.delete(id)
  }

  @ApiOperation({ summary: '批量删除Token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token删除成功' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Token不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '没有权限访问' })
  @Roles(RoleType.ADMIN)
  @Permissions({ subject: SubjectsEnum.Token, action: Action.Delete })
  @Delete('many')
  async deleteTokenMany(@Body() ids: string) {
    return this.tokenService.deleteMany(ids)
  }
}

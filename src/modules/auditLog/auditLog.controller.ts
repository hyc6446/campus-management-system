import {
  Controller,
  Post,
  Body,
  UsePipes,
  Param,
  HttpStatus,
  Get,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger'
import { ZodValidationPipe } from '@common/pipes/validation.pipe'
import { CurrentUser } from '@common/decorators/current-user.decorator'
import { User } from '@modules/user/user.entity'
import { AuthGuard } from '@common/guards/auth.guard'
import { RoleName } from '@modules/auth/dto/index';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@app/common/guards/roles.guard'
import { CreateAuditLogDto, CreateAuditLogDtoSwagger, CreateAuditLogSchema, QueryAuditLogSchema, UpdateAuditLogDto, UpdateAuditLogDtoSwagger, UpdateAuditLogSchema } from '@modules/auditLog/dto/index'
import { AuditLogService } from '@modules/auditLog/auditLog.service'
import { AuditLog } from '@modules/auditLog/entities/auditLog.entity'

@ApiTags('审计日志')
@Controller('auditLog')
@UseGuards(AuthGuard, RolesGuard)
export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  @ApiOperation({ summary: '查询审计日志' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量', example: 10 })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取审计日志列表', type: AuditLog, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @Roles(RoleName.ADMIN)
  @Get('query')
  @UsePipes(new ZodValidationPipe(QueryAuditLogSchema))
  async findAll(    
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @CurrentUser() currentUser: User) {
    return await this.auditLogService.findAll(page, limit, {}, currentUser)
  }

  @ApiOperation({ summary: '查询用户操作的审计日志' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '每页数量', example: 10 })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取审计日志列表', type: AuditLog, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的查询参数' })
  @Roles(RoleName.ADMIN)
  @Get('query/user/:userId')
  @UsePipes(new ZodValidationPipe(QueryAuditLogSchema))
  async findAllByUserId(    
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Param('userId') userId: number,
    @CurrentUser() currentUser: User) {
    return await this.auditLogService.findByUserId(page, limit, userId, currentUser)
  }

  @ApiOperation({ summary: '创建审计日志' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateAuditLogDtoSwagger })
  @ApiResponse({ status: HttpStatus.CREATED, description: '审计日志创建成功', type: AuditLog })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @Post()
  @UsePipes(new ZodValidationPipe(CreateAuditLogSchema))
  async create(@Body() createAuditLogDto: CreateAuditLogDto) {
    return await this.auditLogService.create(createAuditLogDto)
  }

  @ApiOperation({ summary: '获取指定审计日志信息' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '审计日志ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取审计日志信息', type: AuditLog })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '审计日志不存在' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentUser() currentUser: User) {
    return await this.auditLogService.findById(id, currentUser)
  }

  @ApiOperation({ summary: '更新审计日志' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '审计日志ID', type: Number })
  @ApiBody({ type: UpdateAuditLogDtoSwagger })
  @ApiResponse({ status: HttpStatus.OK, description: '审计日志更新成功', type: AuditLog })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '审计日志不存在' })
  @Roles(RoleName.ADMIN)
  @Put(':id')
  @UsePipes(new ZodValidationPipe(UpdateAuditLogSchema))
  async update( @Param('id') id: number, @Body() updateAuditLogDto: UpdateAuditLogDto, @CurrentUser() currentUser: User ) {
    return await this.auditLogService.update(id, updateAuditLogDto, currentUser)
  }

  @ApiOperation({ summary: '删除审计日志' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '审计日志ID', type: Number })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '无效的输入数据' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: '审计日志删除成功' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: '无权限' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '审计日志不存在' })
  @Roles(RoleName.ADMIN)
  @Post('delete')
  async delete(@Param('id') id: number, @CurrentUser() currentUser: User ) {
    return this.auditLogService.delete(id, currentUser)
  }
}

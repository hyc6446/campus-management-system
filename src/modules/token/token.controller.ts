import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { TokenType } from '@prisma/client';
import { RoleName } from '@modules/auth/dto/index';
import { TokenService } from './token.service';
import { Token } from './token.entity';

@ApiTags('Token管理')
@Controller('tokens')
@UseGuards(AuthGuard, RolesGuard)
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @ApiOperation({ summary: '根据ID获取Token信息' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Token ID', type: Number })
  @ApiResponse({ status: 200, description: '成功获取Token信息', type: Token })
  @ApiResponse({ status: 404, description: 'Token不存在' })
  @Roles(RoleName.ADMIN)
  @Get(':id')
  async getTokenById(@Param('id') id: number): Promise<Token> {
    return this.tokenService.findById(id);
  }

  @ApiOperation({ summary: '根据Token值获取Token信息' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'token', description: 'Token值', type: String })
  @ApiResponse({ status: 200, description: '成功获取Token信息', type: Token })
  @ApiResponse({ status: 404, description: 'Token不存在' })
  @Roles(RoleName.ADMIN)
  @Get('by-token')
  async getTokenByValue(@Query('token') tokenValue: string): Promise<Token> {
    return this.tokenService.findByToken(tokenValue);
  }

  @ApiOperation({ summary: '获取用户的所有Token' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: '用户ID', type: Number })
  @ApiQuery({ name: 'type', description: 'Token类型', type: String, required: false })
  @ApiResponse({ status: 200, description: '成功获取用户的Token列表', type: [Token] })
  @Roles(RoleName.ADMIN)
  @Get('user/:userId')
  async getUserTokens(
    @Param('userId') userId: number, 
    @Query('type') type?: string
  ): Promise<Token[]> {
    if (type && Object.values(TokenType).includes(type as TokenType)) {
      const token = await this.tokenService.findByUserIdAndType(userId, type as TokenType);
      return token ? [token] : [];
    }
    // 如果没有指定类型，返回所有类型的Token
    const token = await this.tokenService.findByUserId(userId);
    return token ? [token] : [];
  }

  @ApiOperation({ summary: '获取用户的有效Token' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: '用户ID', type: Number })
  @ApiQuery({ name: 'type', description: 'Token类型', type: String, required: false })
  @ApiResponse({ status: 200, description: '成功获取用户的有效Token列表', type: [Token] })
  @Roles(RoleName.ADMIN)
  @Get('user/:userId/active')
  async getUserActiveTokens(
    @Param('userId') userId: number, 
    @Query('type') type?: string
  ): Promise<Token[]> {
    if (type && Object.values(TokenType).includes(type as TokenType)) {
      return this.tokenService.findActiveByUserIdAndType(userId, type as TokenType);
    }
    // 如果没有指定类型，返回所有类型的有效Token
    return this.tokenService.findActiveByUserId(userId);
  }

  @ApiOperation({ summary: '验证Token有效性' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'token', description: 'Token值', type: String })
  @ApiQuery({ name: 'type', description: 'Token类型', type: String })
  @ApiResponse({ status: 200, description: 'Token有效' })
  @ApiResponse({ status: 400, description: 'Token无效' })
  @ApiResponse({ status: 404, description: 'Token不存在' })
  @Roles(RoleName.ADMIN)
  @Get('validate')
  async validateToken(
    @Query('token') tokenValue: string, 
    @Query('type') type: string
  ): Promise<{ valid: boolean; message?: string }> {
    if (!type || !Object.values(TokenType).includes(type as TokenType)) {
      return { valid: false, message: '无效的Token类型' };
    }
    
    try {
      await this.tokenService.validateToken(tokenValue, type as TokenType);
      return { valid: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Token验证失败';
      return { valid: false, message };
    }
  }

  @ApiOperation({ summary: '撤销指定Token' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Token ID', type: Number })
  @ApiResponse({ status: 200, description: 'Token撤销成功', type: Token })
  @ApiResponse({ status: 404, description: 'Token不存在' })
  @Roles(RoleName.ADMIN)
  @Put(':id/revoke')
  async revokeToken(@Param('id') id: number): Promise<Token> {
    return this.tokenService.revoke(id);
  }

  @ApiOperation({ summary: '撤销用户的所有指定类型Token' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: '用户ID', type: Number })
  @ApiQuery({ name: 'type', description: 'Token类型', type: String })
  @ApiResponse({ status: 200, description: 'Token撤销成功', type: [Token] })
  @Roles(RoleName.ADMIN)
  @Put('user/:userId/revoke')
  async revokeUserTokens(
    @Param('userId') userId: number, 
    @Query('type') type: string
  ): Promise<Token[]> {
    if (!type || !Object.values(TokenType).includes(type as TokenType)) {
      throw new Error('无效的Token类型');
    }
    return this.tokenService.revokeAllByUserIdAndType(userId, type as TokenType);
  }

  @ApiOperation({ summary: '删除指定Token' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Token ID', type: Number })
  @ApiResponse({ status: 200, description: 'Token删除成功' })
  @ApiResponse({ status: 404, description: 'Token不存在' })
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  async deleteToken(@Param('id') id: number): Promise<{ success: boolean }> {
    await this.tokenService.delete(id);
    return { success: true };
  }

  @ApiOperation({ summary: '删除用户的所有指定类型Token' })
  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: '用户ID', type: Number })
  @ApiQuery({ name: 'type', description: 'Token类型', type: String })
  @ApiResponse({ status: 200, description: 'Token删除成功', schema: { example: { count: 2 } } })
  @Roles(RoleName.ADMIN)
  @Delete('user/:userId')
  async deleteUserTokens(
    @Param('userId') userId: number, 
    @Query('type') type: string
  ): Promise<{ count: number }> {
    if (!type || !Object.values(TokenType).includes(type as TokenType)) {
      throw new Error('无效的Token类型');
    }
    const count = await this.tokenService.deleteByUserIdAndType(userId, type as TokenType);
    return { count };
  }
}

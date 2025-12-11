import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { TokenType } from '@prisma/client';
import { Token } from '../entities/token.entity';
// import { TokenSelect, TokenWithFields } from '@app/common/types/entity/token.type';

@Injectable()
export class TokenRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 根据ID查找Token
   * @param id Token ID
   * @returns Token对象或null
   */
  async findById(id: number, includeUser: boolean = false): Promise<Token | null> {
    const tokenData = await this.prisma.token.findUnique({
      where: { id },
      include: {
        user: includeUser,
      },
    });
    return tokenData ? new Token(tokenData as Partial<Token>) : null;
  }

  /**
   * 根据token值查找Token
   * @param token Token值
   * @returns Token对象或null
   */
  async findByToken(token: string, includeUser: boolean = false): Promise<Token | null> {
    const tokenData = await this.prisma.token.findUnique({
      where: { token },
      include: {
        user: includeUser,
      },
    });
    return tokenData ? new Token(tokenData as Partial<Token>) : null;
  }

  /**
   * 根据用户ID和类型查找Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns Token对象数组
   */
  async findByUserIdAndType(userId: number, type: TokenType, includeUser: boolean = false): Promise<Token | null> {
    const tokenData = await this.prisma.token.findFirst({
      where: {
        userId,
        type,
        deletedAt: null,
      },
      include: {
        user: includeUser,
      },
    });
    return tokenData ? new Token(tokenData as Partial<Token>) : null;
  }

  /**
   * 根据用户ID查找Token
   * @param userId 用户ID
   * @returns Token对象或null 
   */
  async findByUserId(userId: number, includeUser: boolean = false): Promise<Token | null> {
    const tokenData = await this.prisma.token.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        user: includeUser,
      },
    });
    return tokenData ? new Token(tokenData as Partial<Token>) : null;
  }

  /**
   * 查找所有未过期且未撤销的Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns Token对象数组
   */
  async findActiveByUserIdAndType(
    userId: number, 
    type: TokenType,
    includeUser: boolean = false
  ): Promise<Token[]> {
    const tokenDataList = await this.prisma.token.findMany({
      where: {
        userId,
        type,
        deletedAt: null,
        expiresAt: { gte: new Date() },
      },
      include: {
        user: includeUser,
      },
    });
    return tokenDataList.map(token => new Token(token as Partial<Token>));
  }

  /**
   * 查找所有未过期且未撤销的Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns Token对象数组
   */
  async findActiveByUserId(
    userId: number, 
    includeUser: boolean = false
  ): Promise<Token[]> {
    const tokenDataList = await this.prisma.token.findMany({
      where: {
        userId,
        deletedAt: null,
        expiresAt: { gte: new Date() },
      },
      include: {
        user: includeUser,
      },
    });
    return tokenDataList.map(token => new Token(token as Partial<Token>));
  }

  /**
   * 撤销Token
   * @param id Token ID
   * @returns 撤销后的Token
   */
  async revoke(id: number): Promise<Token> {
    return this.update(id, { deletedAt: new Date() });
  }

  /**
   * 撤销指定用户的所有特定类型Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns 撤销后的Token数组
   */
  async revokeAllByUserIdAndType(
    userId: number, 
    type: TokenType
  ): Promise<Token[]> {
    await this.prisma.token.updateMany({
      where: { userId, type },
      data: { deletedAt: new Date() }
    });
    // 查询并返回更新后的Token列表
    return this.findActiveByUserIdAndType(userId, type);
  }



  /**
   * 创建新Token
   * @param tokenData Token数据
   * @param includeUser 是否包含用户信息
   * @returns 创建的Token
   */
  async create(tokenData: Partial<Token>): Promise<Token> {
    const createdToken = await this.prisma.token.create({
      data: {
        userId: tokenData.userId as number,
        token: tokenData.token || '',
        type: tokenData.type || TokenType.REFRESH,
        expiresAt: tokenData.expiresAt || new Date(),
        deletedAt: tokenData.deletedAt || null,
      },
    });
    return createdToken as Token;
  }

  /**
   * 创建多个Token
   * @param tokenDataList Token数据数组
   * @returns 创建的Token数组
   */
  async createMany(tokenDataList: Partial<Token>[]): Promise<Token[]> {
    // 因为createMany不支持include，所以需要逐个创建
    const createdTokens = [];
    for (const tokenData of tokenDataList) {
      const token = await this.create(tokenData);
      createdTokens.push(token);
    }
    return createdTokens as Token[];
  }

  /**
   * 更新Token
   * @param id Token ID
   * @param tokenData 更新的Token数据
   * @returns 更新后的Token
   */
  async update(id: number, tokenData: Partial<Token>, includeUser: boolean = false): Promise<Token> {
    const updatedToken = await this.prisma.token.update({
      where: { id },
      data: {
        token: tokenData.token,
        type: tokenData.type,
        expiresAt: tokenData.expiresAt,
        deletedAt: tokenData.deletedAt, 
        updatedAt: new Date(),
      },
      include: {
        user: includeUser,
      },
    });
    return new Token(updatedToken as Partial<Token>);
  }

  /**
   * 更新指定用户的所有特定类型Token
   * @param userId 用户ID
   * @param type Token类型
   * @param tokenData 更新的Token数据
   * @returns 更新后的Token数组
   */
  async updateByUserIdAndType(
    userId: number, 
    type: TokenType, 
    tokenData: Partial<Token>,
    includeUser: boolean = false
  ): Promise<Token | null> {
    // 首先找到所有符合条件的Token
    const token = await this.findByUserIdAndType(userId, type, includeUser);
    
    if (!token)  return null;
    
    // 更新Token
    const updatedToken = await this.update(token.id, tokenData, includeUser);   
    
    return updatedToken;
  }

  /**
   * 删除Token
   * @param id Token ID
   * @returns 删除结果
   */
  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.token.update({ where: { id }, data: { deletedAt: new Date() } });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 删除指定用户的所有特定类型Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns 删除的数量
   */
  async deleteByUserIdAndType(userId: number, type: TokenType): Promise<number> {
    const result = await this.prisma.token.updateMany({
      where: { userId, type },
      data: { deletedAt: new Date() },
    });
    return result.count;
  }



  /**
   * 检查Token是否有效
   * @param token Token值
   * @param type Token类型
   * @returns 是否有效
   */
  async isTokenValid(token: string, type: TokenType): Promise<boolean> {
    const tokenData = await this.prisma.token.findUnique({
      where: { token },
      select: {
        id: true,
        type: true,
        deletedAt: true,
        expiresAt: true,
      },
    });
    
    return (
      !!tokenData &&
      tokenData.type === type &&
      tokenData.deletedAt === null &&
      tokenData.expiresAt > new Date()
    );
  }
}

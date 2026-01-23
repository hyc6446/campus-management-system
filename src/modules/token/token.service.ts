import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TokenType } from '@prisma/client';
import { TokenRepository } from './token.repository';
import { Token } from './token.entity';
// import { TokenSelect, TokenWithFields } from '@app/common/types/entity/token.type';

@Injectable()
export class TokenService {
  constructor(private tokenRepository: TokenRepository) {}

  /**
   * 根据ID查找Token
   * @param id Token ID
   * @returns Token对象
   * @throws NotFoundException Token不存在
   */
  async findById(id: number): Promise<Token> {
    const token = await this.tokenRepository.findById(id);
    if (!token) {
      throw new NotFoundException('Token不存在');
    }
    return token;
  }

  /**
   * 根据token值查找Token
   * @param tokenValue Token值
   * @returns Token对象
   * @throws NotFoundException Token不存在
   */
  async findByToken(tokenValue: string): Promise<Token> {
    const token = await this.tokenRepository.findByToken(tokenValue);
    if (!token) {
      throw new NotFoundException('Token不存在');
    }
    return token;
  }

  /**
   * 根据用户ID和类型查找Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns Token对象
   */
  async findByUserIdAndType(userId: number, type: TokenType): Promise<Token | null> {
    return this.tokenRepository.findByUserIdAndType(userId, type);
  }
  
  /**
   * 根据用户ID和类型查找Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns Token对象
   */
  async findByUserId(userId: number): Promise<Token | null> {
    return this.tokenRepository.findByUserId(userId);
  }

  /**
   * 查找所有未过期且未撤销的Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns Token对象数组
   */
  async findActiveByUserIdAndType(userId: number, type: TokenType): Promise<Token[]> {
    return this.tokenRepository.findActiveByUserIdAndType(userId, type);
  }

  /**
   * 查找所有未过期且未撤销的Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns Token对象数组
   */
  async findActiveByUserId(userId: number): Promise<Token[]> {
    return this.tokenRepository.findActiveByUserId(userId);
  }

    /**
   * 验证Token有效性
   * @param tokenValue Token值
   * @param type Token类型
   * @returns Token对象
   * @throws NotFoundException Token不存在
   * @throws BadRequestException Token无效
   */
  async validateToken(tokenValue: string, type?: TokenType): Promise<Token | null> {
    const token = await this.tokenRepository.findByToken(tokenValue);
    if (!token) return null;

    // 检查令牌类型是否匹配
    if (type && token.type !== type) return null;

    // 检查是否已撤销
    if (token.deletedAt) return null;

    // 检查是否已过期
    if (token.expiresAt < new Date()) return null;

    return token;
  }

  /**
   * 撤销指定Token
   * @param tokenId Token ID
   * @returns 撤销后的Token
   * @throws NotFoundException Token不存在
   * @throws BadRequestException Token已经被撤销
   */ 
  async revoke(tokenId: number): Promise<Token> {
    const token = await this.findById(tokenId);
    if (!token) {
      throw new NotFoundException('令牌不存在');
    }

    if (token.deletedAt) {
      throw new BadRequestException('令牌已经被撤销');
    }

    return this.tokenRepository.update(tokenId, { deletedAt: new Date() });
  }

  /**
   * 撤销指定用户的所有特定类型Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns 撤销后的Token数组
   */
  async revokeAllByUserIdAndType(userId: number, type: TokenType): Promise<Token[]> {
    return this.tokenRepository.revokeAllByUserIdAndType(userId, type);
  }

  /**
   * 删除Token
   * @param id Token ID
   * @returns 删除结果
   */
  async delete(id: number): Promise<boolean> {
    // 先检查Token是否存在
    const token = await this.findById(id);
    if (!token) {
      throw new NotFoundException('令牌不存在');
    }
    // 使用软删除替代物理删除
    await this.tokenRepository.delete(id);
    return true;
  }

  /**
   * 删除指定用户的所有特定类型Token
   * @param userId 用户ID
   * @param type Token类型
   * @returns 删除的数量
   */
  async deleteByUserIdAndType(userId: number, type: TokenType): Promise<number> {
    return this.tokenRepository.deleteByUserIdAndType(userId, type);
  }

  /**
   * 创建新Token
   * @param tokenData Token数据
   * @returns 创建的Token
   */
  async create(tokenData: Partial<Token>): Promise<Token> {
    return this.tokenRepository.create(tokenData);
  }

  /**
   * 创建多个Token
   * @param tokenDataList Token数据数组
   * @returns 创建的Token数组
   */
  // async createMany(tokenDataList: Partial<Token>[]): Promise<Token[]> {
  //   // 验证每个Token的必要字段
  //   tokenDataList.forEach(tokenData => {
  //     if (!tokenData.userId || !tokenData.token || !tokenData.type || !tokenData.expiresAt) {
  //       throw new BadRequestException('缺少必要的Token数据');
  //     }
  //   });
  //   return this.tokenRepository.createMany(tokenDataList);
  // }

  /**
   * 更新Token
   * @param id Token ID
   * @param tokenData 更新的Token数据
   * @returns 更新后的Token
   */
  // async update(id: number, tokenData: Partial<Token>): Promise<Token> {
  //   // 先检查Token是否存在
  //   await this.findById(id);
  //   return this.tokenRepository.update(id, tokenData);
  // }

  /**
   * 检查Token是否有效
   * @param tokenValue Token值
   * @param type Token类型
   * @returns 是否有效
   */
  async isTokenValid(tokenValue: string, type: TokenType): Promise<boolean> {
    return this.tokenRepository.isTokenValid(tokenValue, type);
  }

  /**
   * 为用户创建新的Refresh Token，并删除旧的Refresh Token
   * @param userId 用户ID
   * @param tokenValue 新的Refresh Token值
   * @param expiresAt 新的Refresh Token过期时间
   * @returns 创建的Refresh Token
   */
  async createRefreshToken(
    userId: number, 
    tokenValue: string, 
    expiresAt: Date,
  ): Promise<Token> {
    // 先删除该用户所有旧的Refresh Token
    await this.deleteByUserIdAndType(userId, TokenType.REFRESH);
    // 创建新的Refresh Token
    return this.tokenRepository.create({
      userId,
      token: tokenValue,
      type: TokenType.REFRESH,
      expiresAt,
      deletedAt: null
    });
  }

  /**
   * 验证Refresh Token
   * @param tokenValue Refresh Token值
   * @returns Token对象
   */
  async validateRefreshToken(tokenValue: string): Promise<Token> {
    const token = await this.validateToken(tokenValue, TokenType.REFRESH);
    if (!token) {
      throw new BadRequestException('无效的Refresh Token');
    }
    return token;
  }
}

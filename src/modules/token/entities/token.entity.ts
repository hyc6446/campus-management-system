// import { Exclude } from 'class-transformer';
import { TokenType } from '@prisma/client';
/**
 * Token实体类
 */
export class Token {
  /**
   * Token的唯一标识符
   */
  id!: number;

  /**
   * 关联的用户ID
   */
  userId!: number;

  /**
   * Token字符串值
   */
  token: string = '';

  /**
   * Token类型
   */
  type: TokenType = TokenType.REFRESH;

  /**
   * Token过期时间
   */
  expiresAt!: Date;

  /**
   * 是否已撤销
   */
  revoked: boolean = false;

  /**
   * Token创建时间
   */
  createdAt: Date = new Date();

  /**
   * Token更新时间
   */
  updatedAt!: Date;

  constructor(partial: any = {}) {
    this.id= partial.id || 0
    this.userId= partial.userId || 0
    this.token= partial.token || ''
    this.type= partial.type || TokenType.REFRESH
    this.expiresAt= partial.expiresAt || new Date()
    this.revoked= partial.revoked || false
    this.createdAt= partial.createdAt || new Date()
    this.updatedAt= partial.updatedAt || new Date()
  }
}

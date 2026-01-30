import { TokenType } from '@prisma/client';


export class Token {
  id!: number;
  userId!: number;
  token: string = '';
  type: TokenType = TokenType.REFRESH;
  expiresAt!: Date;
  updatedAt!: Date;

  constructor(partial: any = {}) {
    this.id= partial.id || 0
    this.userId= partial.userId || 0
    this.token= partial.token || ''
    this.type= partial.type || TokenType.REFRESH
    this.expiresAt= partial.expiresAt || new Date()
    this.updatedAt= partial.updatedAt || new Date()
  }
}

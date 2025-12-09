// 测试@prisma/client是否导出Token类型
import { PrismaClient, Token } from '@prisma/client';

// 尝试使用Token类型
const token: Token | null = null;
console.log('Token类型测试', token);

// 尝试使用PrismaClient
const prisma = new PrismaClient();
console.log('PrismaClient测试', prisma);
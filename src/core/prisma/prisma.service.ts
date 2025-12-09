/**
 * PrismaService - 数据库服务类
 * 
 * 扩展了PrismaClient，提供数据库连接管理、生命周期钩子和辅助方法
 * 实现了OnModuleInit接口，确保模块初始化时连接数据库
 */
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { config } from 'dotenv';

// 加载环境变量
config();

/**
 * PrismaService类 - NestJS的数据库服务层
 * 负责数据库连接、断开连接和测试环境的数据库清理
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  /**
   * 构造函数 - 初始化PrismaClient
   * 根据环境变量配置日志级别和数据源
   */
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.APP_ENV === 'development' 
        ? ['query', 'error', 'warn'] // 开发环境记录查询、错误和警告
        : ['error'],                // 生产环境只记录错误
    });
  }

  /**
   * 生命周期钩子 - 模块初始化时自动连接数据库
   * 实现OnModuleInit接口的方法
   */
  async onModuleInit() {
    await this.$connect(); // 连接到数据库
  }
  /**
   * 执行事务
   * 包装了PrismaClient的$transaction方法，确保TypeScript类型正确识别
   * @param fn 事务中要执行的函数
   * @returns 事务执行结果
   */
  async transaction<T>(fn: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.$transaction(fn);
  }

  /**
   * 启用关闭钩子 - 确保应用关闭时数据库连接正确关闭
   * @param app NestJS应用实例
   */
  
  async enableShutdownHooks(app: INestApplication) {
    // 修复方式1：使用类型断言处理Prisma事件监听
    // (this as any).$on('beforeExit', async () => {
    //   await app.close();
    // });
    
    // 修复方式2（推荐）：监听Node.js原生进程信号，更可靠且类型安全
    const shutdownSignals = ['SIGINT', 'SIGTERM'];
    
    for (const signal of shutdownSignals) {
      process.on(signal, async () => {
        try {
          console.log(`接收到${signal}信号，正在关闭应用...`);
          // 先关闭Prisma连接
          await this.$disconnect();
          // 再关闭NestJS应用
          await app.close();
          process.exit(0);
        } catch (error) {
          console.error('关闭应用时出错:', error);
          process.exit(1);
        }
      });
    }
  }

  /**
   * 清理数据库 - 仅用于测试环境
   * 删除所有表（除了_prisma_migrations）
   */
  async cleanDatabase() {
    // 安全检查 - 只允许在测试环境中执行
    if (process.env.APP_ENV !== 'test') {
      throw new Error('清空数据库只能在测试环境中执行');
    }

    try {
      // SQLite不支持TRUNCATE CASCADE，使用DELETE FROM代替
      // 获取所有表名（除了迁移表）
      const tableNames = await this.$queryRaw<{ name: string }[]>(
        Prisma.sql`SELECT name FROM sqlite_master WHERE type='table' AND name != '_prisma_migrations'`
      );
      
      // 构建DELETE语句
      for (const table of tableNames) {
        await this.$executeRawUnsafe(`DELETE FROM ${table.name};`);
        // 重置自增序列
        await this.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name='${table.name}';`);
      }
    } catch (error) {
      console.error(error);
      throw new Error('清空数据库失败');
    }
  }
}
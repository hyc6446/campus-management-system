/**
 * Prisma模块
 * 提供数据库连接和操作功能的核心模块
 * 使用全局装饰器确保该模块在整个应用中可用
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * 全局模块装饰器
 * 标记此模块为全局模块，避免在每个需要使用数据库的模块中重复导入
 */
@Global()
/**
 * 模块装饰器
 * 定义模块的提供者和导出项
 */
@Module({
  // 提供者数组：声明此模块提供的服务
  providers: [PrismaService],
  // 导出数组：声明哪些提供者可以被其他模块导入使用
  exports: [PrismaService],
})
/**
 * Prisma模块类
 * 负责管理Prisma数据库连接服务的生命周期和依赖注入
 */
export class PrismaModule {}
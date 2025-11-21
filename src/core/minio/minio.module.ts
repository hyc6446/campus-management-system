/**
 * MinIO模块
 * 提供对象存储功能的NestJS模块，用于管理文件上传、下载和存储操作
 */
import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { LoggerModule } from '@core/logger/logger.module';

/**
 * MinioModule类
 * 配置并注册MinioService服务
 * - 在providers中注册MinioService，使其可以被模块内的组件注入
 * - 在exports中导出MinioService，使其可以被其他模块注入和使用
 */
@Module({
  imports: [LoggerModule],
  // 注册MinioService作为该模块的提供者
  providers: [MinioService],
  // 导出MinioService，允许其他模块导入和使用该服务
  exports: [MinioService],
})
export class MinioModule {}
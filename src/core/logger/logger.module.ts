import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as NestPinoLoggerModule } from 'nestjs-pino';
import { LoggerService } from './logger.service';

/**
 * LoggerModule类
 * 配置并注册日志相关服务
 * - 直接使用nestjs-pino模块
 * - 注册LoggerService作为应用的日志服务接口
 * - 导出LoggerService供其他模块使用
 */
@Global() 
@Module({
  // 导入必要的模块
  imports: [
    NestPinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const loggerConfig = configService.get('logger');
        return {
          pinoHttp: {
            level: loggerConfig.level,
            autoLogging: loggerConfig.requestLogging,
            // 自定义序列化器，控制日志输出格式
            serializers: {
              req(req) {
                return {
                  method: req.method,
                  url: req.url,
                  headers: req.headers,
                  remoteAddress: req.remoteAddress,
                };
              },
              res(res) {
                return {
                  statusCode: res.statusCode,
                  headers: res.headers,
                };
              },
            },
            // 自定义属性，添加额外的上下文信息
            customProps: (req, res) => {
              return {
                context: 'HTTP',
                requestId: req.id,
              };
            },
            // 在Windows上确保正确处理中文编码
            destination: process.stdout, // 直接指定输出流
            // 使用transport替代prettyPrint（新版本pino的推荐方式）
            // 优化Windows环境下的中文编码处理
            transport: loggerConfig.prettyPrint ? {
              target: 'pino-pretty',
              options: {
                // 基础配置
                colorize: true,              // 暂时禁用着色，减少编码转换问题
                singleLine: true,             // 使用单行格式，减少复杂性
                timestampKey: 'time',
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
                // 关键的编码配置
                outputEncoding: 'utf8',       // 强制使用UTF-8编码 
                // 简化消息格式，避免额外的编码转换
                messageFormat: '{msg}',       // 移除可能干扰编码的前缀 
              },
            } : undefined,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  
  // 注册服务提供者
  providers: [LoggerService],
  
  // 导出LoggerService，使其可以被其他模块注入和使用
  exports: [LoggerService],

})

export class LoggerModule {}
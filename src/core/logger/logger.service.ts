import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { PinoLogger as Logger } from 'nestjs-pino';

/**
 * LoggerService类
 * 实现NestJS的LoggerService接口，直接使用nestjs-pino提供的Logger
 */
@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(private readonly logger: Logger) {}

  /**
   * 设置日志上下文
   * 注意：nestjs-pino的Logger实例是不可变的，这里主要是为了保持接口兼容
   */
  setContext(context: string): void {
    // nestjs-pino的Logger已经包含了上下文信息，此方法保持向后兼容
    return;
  }

  /**
   * 记录信息级别日志
   * Windows环境下直接使用console.log确保中文正确显示
   */
  log(message: any, context?: string): void {
    // 同时保留pino日志，用于非终端输出
    if (context) {
      this.logger.info({ context }, message);
    } else {
      this.logger.info(message);
    }
  }

  /**
   * 记录错误级别日志
   */
  error(message: any, trace?: string, context?: string): void {
    const logMessage = message instanceof Error ? message.message : message;
    if (context) {
      this.logger.error({ context, trace }, logMessage);
    } else {
      this.logger.error({ trace }, logMessage);
    }
    
    // 如果传入的是Error对象且有堆栈信息，单独记录堆栈
    if (message instanceof Error && message.stack) {
      this.logger.error({ context }, message.stack);
    }
  }

  /**
   * 记录警告级别日志
   */
  warn(message: any, context?: string): void {
    if (context) {
      this.logger.warn({ context }, message);
    } else {
      this.logger.warn(message);
    }
  }

  /**
   * 记录调试级别日志
   */
  debug(message: any, context?: string): void {
    if (context) {
      this.logger.debug({ context }, message);
    } else {
      this.logger.debug(message);
    }
  }

  /**
   * 记录详细级别日志（最详细的日志级别）
   */
  verbose(message: any, context?: string): void {
    // nestjs-pino使用trace级别对应verbose
    if (context) {
      this.logger.trace({ context }, message);
    } else {
      this.logger.trace(message);
    }
  }
}
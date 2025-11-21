import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '@core/logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 设置默认错误状态码和消息
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';
    let details: any = null;

    // 处理不同类型的异常
    if (exception instanceof HttpException) {
      const responseObj = exception.getResponse() as any;
      
      status = exception.getStatus();
      errorCode = responseObj.errorCode || 'HTTP_EXCEPTION';
      message = responseObj.message || exception.message;
      details = responseObj.details || null;
    } else if (exception.name === 'PrismaClientKnownRequestError') {
      // 处理Prisma特定错误
      switch (exception.code) {
        case 'P2002': // 唯一约束失败
          status = HttpStatus.CONFLICT;
          errorCode = 'UNIQUE_CONSTRAINT_FAILED';
          message = '唯一性约束失败';
          details = { constraint: exception.meta?.target };
          break;
        case 'P2025': // 记录不存在
          status = HttpStatus.NOT_FOUND;
          errorCode = 'RECORD_NOT_FOUND';
          message = '请求的记录不存在';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          errorCode = `PRISMA_ERROR_${exception.code}`;
          message = '数据库操作失败';
          details = { prismaError: exception.code };
      }
    } else {
      // 处理其他未知错误
      details = {
        name: exception.name,
        message: exception.message,
        stack: process.env.APP_ENV === 'development' ? exception.stack : undefined,
      };
    }

    // 记录错误日志
    this.logger.error(
      `Error: ${message}, Code: ${errorCode}, Status: ${status}`,
      exception.stack,
      'HttpExceptionFilter',
    );

    // 构建错误响应
    const errorResponse = {
      statusCode: status,
      errorCode,
      message,
      ...(details && { details }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // 设置响应
    response.status(status).json(errorResponse);
  }
}
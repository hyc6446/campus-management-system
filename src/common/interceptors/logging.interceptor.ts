import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@core/logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const method = request.method;
    const url = request.url;
    const userId = request.user?.id || 'anonymous';

    const startTime = Date.now();
    
    this.logger.log(
      `Incoming Request: ${method} ${url} - User: ${userId}`,
      'RequestLogging',
    );

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = response.statusCode;

        this.logger.log(
          `Outgoing Response: ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms - User: ${userId}`,
          'ResponseLogging',
        );
      }),
    );
  }
}

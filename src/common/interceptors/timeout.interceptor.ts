import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { AppException } from '@app/common/exceptions/app.exception'

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(30000), // 30秒超时
      catchError(err => {
        if (err instanceof TimeoutError) {
          throw new AppException('请求超时', 'REQUEST_TIMEOUT', HttpStatus.REQUEST_TIMEOUT)
        }
        throw err
      })
    )
  }
}

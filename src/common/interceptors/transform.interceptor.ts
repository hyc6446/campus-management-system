import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseUtil } from '../utils/response.util';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // 获取响应对象
        // const response = context.switchToHttp().getResponse();
        
        // 获取请求对象
        // const request = context.switchToHttp().getRequest();
        
        // 检查是否已经有ResponseUtil格式的数据
        // 如果数据已经是标准格式，直接返回
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // 处理分页数据
        if (data && typeof data === 'object' && data.hasOwnProperty('data') && data.hasOwnProperty('total')) {
          // 这是分页数据格式
          return ResponseUtil.success({
            data: data.data,
            total: data.total,
            page: data.page || 1,
            pageSize: data.pageSize || 10,
            hasNextPage: data.total > (data.page || 1) * (data.pageSize || 10),
          });
        }

        // 处理普通数据
        return ResponseUtil.success(data);
      }),
    );
  }
}
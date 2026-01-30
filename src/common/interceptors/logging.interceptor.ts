import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap, catchError } from 'rxjs/operators'
import { KafkaService } from '@app/core/kafka/kafka.service'
import { KafkaTopics } from '@app/core/kafka/kafka-topic.config'
import { IS_PUBLIC_KEY } from '@app/common/decorators/public-auth.decorator'
import { Reflector } from '@nestjs/core'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly kafkaService: KafkaService,
    private reflector: Reflector
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) return next.handle()
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const method = request.method
    const url = request.url
    const userId = request.user?.id || 'anonymous'
    const agent = request.headers['user-agent'] || 'unknown'
    const ip = request.ip || 'unknown'
    const className = context.getClass().name
    const handler = context.getHandler()
    const methodName = handler.name
    const startTime = Date.now()
    const params = {
      body: request.body,
      query: request.query,
      params: request.params,
    }

    return next.handle().pipe(
      tap(data => {
        const endTime = Date.now()
        const duration = endTime - startTime
        const statusCode = response.statusCode
        const business_log = {
          className,
          methodName,
          method,
          url,
          userId,
          params,
          statusCode,
          duration,
          data,
          ip,
          agent,
        }
        // 异步发送消息，不阻塞请求处理
        this.kafkaService.sendMessage(KafkaTopics.BusinessLogs, [
          { key: userId, value: JSON.stringify(business_log) },
        ]).catch(error => {
          console.error('Kafka消息发送失败:', error)
        })
      }),
      catchError(error => {
        const endTime = Date.now()
        const duration = endTime - startTime
        const business_log = {
          className,
          methodName,
          method,
          url,
          userId,
          params,
          statusCode: error.status || 500,
          duration,
          data: error.message,
          ip,
          agent,
        }
        // 异步发送消息，不阻塞错误处理
        this.kafkaService.sendMessage(KafkaTopics.BusinessLogs, [business_log]).catch(error => {
          console.error('Kafka消息发送失败:', error)
        })
        throw error
      })
    )
  }
}

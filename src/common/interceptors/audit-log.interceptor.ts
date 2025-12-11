import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { tap, catchError, finalize } from 'rxjs/operators'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AUDIT_LOG_METADATA_KEY, AuditLogOptions } from '@common/decorators/audit-log.decorator'
import { AuditLogService } from '@modules/auditLog/auditLog.service'
import { AuditLogData } from '@common/types/audit-log.types'
import { UserService } from '@modules/user/user.service'
/**
 * 审计日志拦截器
 * 用于自动记录被@AuditLog装饰器标记的方法的审计日志
 */
@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditLogService: AuditLogService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // 获取方法上的@AuditLog装饰器元数据
    const options = this.reflector.get<AuditLogOptions>(
      AUDIT_LOG_METADATA_KEY,
      context.getHandler()
    )
    // 如果没有@AuditLog装饰器，直接执行目标方法
    if (!options) return next.handle()

    // 从请求上下文获取HTTP请求
    const httpContext: HttpArgumentsHost = context.switchToHttp()
    const request = httpContext.getRequest()
    const response = httpContext.getResponse()

    // 3. 收集基本信息
    const startTime = Date.now()
    const ip = this.getClientIp(request) || 'unknown'
    const userAgent = request.headers['user-agent'] || 'unknown'
    const path = options.path || request.url
    const method = options.method || request.method

    // 5. 获取方法和控制器名称
    const handler = context.getHandler()
    const className = context.getClass().name
    // 6. 准备日志数据
    const auditLogData: AuditLogData = {
      userId: 0,
      action: options.action?.toUpperCase() || handler.name.toUpperCase(),
      resource: options.resource?.toUpperCase() || className.replace('Controller', '').toUpperCase(),
      resourceId: 'unknown',
      method,
      path,
      isSuccess: true,
      duration: 0,
      timestamp: undefined,
      details: {},
      ip,
      userAgent,
    }

    // 执行请求并处理结果
    return next.handle().pipe(
      tap(data => {
        // 处理成功响应
        const context = { request, response, data }
        this.completeAuditLog(auditLogData, options, context, startTime, true)
      }),
      catchError(error => {
        // 处理请求错误
        // 解析resourceId（错误情况下可能没有response.data）
        const context = { request, response, data: error }
        this.completeAuditLog(auditLogData, options, context, startTime, false)
        throw error
      }),
      finalize(() => {
        // 确保日志记录，即使在流被取消的情况下也会执行
        if (auditLogData.duration === undefined) {
          this.completeAuditLog(auditLogData, options, undefined, startTime, false)
        }
      })
    )
  }

  /**
   * 从客户端请求中获取IP地址
   * @param request HTTP请求对象
   * @returns 客户端IP地址
   */
  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.ip ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    )
  }

  private async completeAuditLog(
    auditLogData: AuditLogData,
    options: AuditLogOptions,
    context: any,
    startTime: number,
    isSuccess: boolean
  ): Promise<void> {
    // 设置日志的通用属性
    auditLogData.duration = Date.now() - startTime
    auditLogData.timestamp = new Date()
    auditLogData.isSuccess = isSuccess
    auditLogData.resourceId = this.resolveValue(options.resourceIdPath!, context)
    auditLogData.userId = await this.formatUserId(options.userIdPath!, context)
    if (options.logParams) {
      auditLogData.details!.params = this.getRequestParams(context.request, options.sensitiveFields)
    }
    if (isSuccess) {
      auditLogData.details!.result = options.logResult
        ? this.sanitizeData(context.data, options.sensitiveFields)
        : {}
    } else {
      const errorDetails = {
        message: context.data.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? context.data.stack : undefined,
        status: context.data.status || 500,
      }
      auditLogData.details!.error = context ? errorDetails : undefined
    }
    // 记录日志 - 如果没有用户，创建一个最小化的用户对象用于权限检查
    this.auditLogService.create(auditLogData as AuditLogData)
  }

  /**
   * 从HTTP请求中提取参数（body、query、params）并清理敏感数据
   * @param request HTTP请求对象
   * @param sensitiveFields 敏感字段配置
   * @returns 包含清理后的参数的对象
   */
  private getRequestParams(
    request: any,
    sensitiveFields?: string[] | ((key: string) => boolean)
  ): Record<string, any> {
    const params = {
      body: request.body || {},
      query: request.query || {},
      params: request.params || {},
    }

    return this.sanitizeData(params, sensitiveFields)
  }
  /**
   * 递归克隆对象并清理敏感数据
   * @param obj 要克隆的对象
   * @returns 克隆后的对象
   */
  private cloneAndClean(obj: any): any {
    // 处理特殊类型
    if (obj instanceof Date) return new Date(obj)
    if (obj instanceof RegExp) return obj
    if (typeof obj === 'function') {
      return `[Function: ${obj.name || 'anonymous'}]`
    }
    try {
      return JSON.parse(JSON.stringify(obj))
    } catch (e) {
      return this.handleUnserializable(obj)
    }
  }
  /**
   * 处理无法序列化的对象
   * @param obj 无法序列化的对象
   * @returns 处理后的字符串表示
   */
  private handleUnserializable(obj: any): any {
    if (Buffer.isBuffer(obj)) {
      return `[Buffer: ${obj.length} bytes]`
    }
    if (obj.constructor?.name === 'IncomingMessage') return 'IncomingMessage'
    if (obj.constructor?.name === 'ServerResponse') return 'ServerResponse'
    return `[${obj.constructor?.name || 'Object'}]`
  }
  /**
   * 格式化用户id，确保为数字类型
   * 如果用户id为'unknown'，则返回0
   * @param userIdPath 用户id路径或函数
   * @param context 上下文对象，包含request、response、data
   * @returns 格式化后的用户id
   */
  private async formatUserId(
    userIdPath: string | ((data: any) => string),
    context: { request: any; response: any; data: any }
  ): Promise<number> {  
    // 1、从请求中获取用户id
    if (context.request?.user?.id) {
      return Number(context.request.user.id) || 0
    }
    // 2、从请求头中获取accessToken
    const accessToken = context?.request?.headers['authorization']
    if (accessToken) {
      const token = accessToken.replace('Bearer ', '')
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('auth.jwtSecret'),
      }) as any
      return Number(payload.sub) || 0
    }
    // 3、从上下文数据中获取用户id
    const userIdStr = this.resolveValue(userIdPath, context)
    if (userIdStr === 'unknown'){
      const defaultUserId = await this.getDefaultUserId()
      return defaultUserId || 0
    } 
    return Number(userIdStr) || 0
  }
  /**
   * 获取默认用户id
   * @returns 默认用户id
   */
  private async getDefaultUserId(): Promise<number> {
   const user:any = await this.userService.findByEmailOptional('anonymous@example.com');
   return Number(user?.id) || 0
  }
  /**
   * 解析路径字符串或执行函数获取值
   * @param pathOrFn 路径字符串或函数
   * @param context 上下文对象，包含request、response、data
   * @returns 解析后的值
   */
  private resolveValue(
    pathOrFn: string | ((data: any) => string),
    context: { request: any; response: any; data: any }
  ): string {
    if (typeof pathOrFn === 'function') {
      return pathOrFn(context)
    }
    return this.extractValueFromPath(context, pathOrFn)
  }
  /**
   * 从对象路径中提取值
   * @param context 上下文对象，包含request、response、data
   * @param path 对象路径，如'data.id' 省略默认的context
   * @returns 提取的值
   */
  private extractValueFromPath( context: { request: any; response: any; data: any }, path: string ): string {
    try {
      if (!path) return 'unknown'
      // 处理路径 - 移除可能的'context.'前缀，直接从context对象开始解析
      if (path.startsWith('context.')) {
        path = path.slice('context.'.length)
      }
      const keys = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.')
      let value: any = context
      for (const key of keys) {
        if (value === undefined || value === null) return 'unknown'
        value = value[key]
      }
      return value.toString() || 'unknown'
    } catch (error) {
      return 'unknown'
    }
  }
  /**
   * 检查字段是否敏感
   * @param key 字段名
   * @param sensitiveFields 敏感字段配置，可以是字符串数组或函数
   * @returns 是否为敏感字段
   */
  private isSensitiveField(
    key: string,
    sensitiveFields: string[] | ((key: string) => boolean) = []
  ): boolean {
    if (typeof sensitiveFields === 'function') {
      return sensitiveFields(key)
    }
    return sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))
  }
  /**
   * 递归处理对象，将敏感字段值替换为掩码
   * @param data 要处理的对象
   * @param sensitiveFields 敏感字段配置
   * @returns 处理后的对象
   */
  private sanitizeData(
    data: any,
    sensitiveFields: string[] | ((key: string) => boolean) = []
  ): any {
    if (!data || typeof data !== 'object') return data
    return this.maskSensitiveData(this.cloneAndClean(data), sensitiveFields)
  }
  /**
   * 递归处理对象，将敏感字段值替换为掩码
   * @param obj 要处理的对象
   * @param sensitiveFields 敏感字段配置
   * @returns 处理后的对象
   */
  private maskSensitiveData(obj: any, sensitiveFields: string[] | ((key: string) => boolean)): any {
    if (!obj || typeof obj !== 'object') return obj
    for (const key of Object.keys(obj)) {
      const isSensitive = this.isSensitiveField(key, sensitiveFields)
      if (isSensitive) {
        obj[key] = '****'
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = this.maskSensitiveData(obj[key], sensitiveFields)
      }
    }

    return obj ?? undefined
  }
}

import { SetMetadata } from '@nestjs/common';

/**
 * 审计日志装饰器元数据键
 */
export const AUDIT_LOG_METADATA_KEY = 'audit_log_metadata';

/**
 * 审计日志装饰器选项
 */
export interface AuditLogOptions {
  path?: string;
  method?: string;
  action: string;
  resource?: string;
  resourceIdPath: string | ((context: { request: any; response: any; data: any }) => string);
  userIdPath?: string | ((context: { request: any; response: any; data: any }) => string);
  logParams?: boolean;
  logResult?: boolean;
  success?: boolean;
  sensitiveFields?: string[] | ((key: string) => boolean);
}



export const AuditLog = (options: AuditLogOptions) => {
  // 设置默认值
  const defaultOptions: Partial<AuditLogOptions> = {
    logParams: true,
    logResult: true,
    success: true,
    userIdPath: 'currentUser.id',
    sensitiveFields: ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'apiKey'],
  };
  
  // 合并用户选项和默认选项
  const mergedOptions = { ...defaultOptions, ...options };
  
  return SetMetadata(AUDIT_LOG_METADATA_KEY, mergedOptions);
};

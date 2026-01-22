export interface AuditLogDeatil {
  params?: Record<string, any> | undefined;
  result?: Record<string, any> | undefined;
  error?: Record<string, any> | undefined;
}

export enum MethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export interface AuditLogData {
  userId: number;
  action: string;
  resource: string;
  resourceId?: string;
  method: MethodEnum;
  path: string;
  duration: number;         // 请求处理时长（毫秒）
  timestamp?: Date | undefined;
  isSuccess: boolean;
  details: AuditLogDeatil;
  ip: string;
  userAgent?: string;
}

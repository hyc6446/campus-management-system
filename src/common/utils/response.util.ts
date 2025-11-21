export class ResponseUtil {
  static success<T>(data?: T, message: string = '操作成功'): ResponseDto<T> {
    return {
      code: 200,
      success: true,
      message,
      data: data ?? null,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string = '操作失败', code: number = 400): ResponseDto<null> {
    return {
      code,
      success: false,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  static unauthorized(message: string = '未授权访问'): ResponseDto<null> {
    return {
      code: 401,
      success: false,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  static notFound(message: string = '资源未找到'): ResponseDto<null> {
    return {
      code: 404,
      success: false,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  static validationError(message: string = '验证失败', errors?: any): ResponseDto<{ errors: any } | null> {
    return {
      code: 422,
      success: false,
      message,
      data: errors ? { errors } : null,
      timestamp: new Date().toISOString(),
    };
  }
}

export interface ResponseDto<T> {
  code: number;
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}
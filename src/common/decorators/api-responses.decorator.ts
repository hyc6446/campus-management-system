import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrResDto } from '../validators/zod-validators';

export function ApiBadRequest() {
  return ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '参数有误', type: ErrResDto });
}

export function ApiForbidden() {
  return ApiResponse({ status: HttpStatus.FORBIDDEN, description: '权限不足', type: ErrResDto });
}

export function ApiUnauthorized(description: string = '未授权') {
  return ApiResponse({ status: HttpStatus.UNAUTHORIZED, description, type: ErrResDto });
}

export function ApiLocked(description: string = '资源已被锁定') {
  return ApiResponse({ status: HttpStatus.LOCKED, description, type: ErrResDto });
}

export function ApiGone(description: string = '资源状态异常') {
  return ApiResponse({ status: HttpStatus.GONE, description, type: ErrResDto });
}

export function ApiNotFound(description: string = '资源不存在') {
  return ApiResponse({ status: HttpStatus.NOT_FOUND, description, type: ErrResDto });
}

export function ApiConflict(description: string = '资源冲突') {
  return ApiResponse({ status: HttpStatus.CONFLICT, description, type: ErrResDto });
}

export function ApiOk(type: any, description: string = '操作成功') {
  return ApiResponse({ status: HttpStatus.OK, description, type });
}

export function ApiCreated(type: any, description: string = '创建成功') {
  return ApiResponse({ status: HttpStatus.CREATED, description, type });
}

export function ApiResponses(options?: {
  noAuth?: boolean | string;
  locked?: boolean | string;
  gone?: boolean | string;
  notFound?: boolean | string;
  conflict?: boolean | string;
}) {
  return applyDecorators(
    ApiBadRequest(),
    ApiForbidden(),
    options?.noAuth ? ApiUnauthorized(typeof options.noAuth === 'string' ? options.noAuth : undefined) : (() => () => {})(),
    options?.locked ? ApiLocked(typeof options.locked === 'string' ? options.locked : undefined) : (() => () => {})(),
    options?.gone ? ApiGone(typeof options.gone === 'string' ? options.gone : undefined) : (() => () => {})(),
    options?.notFound ? ApiNotFound(typeof options.notFound === 'string' ? options.notFound : undefined) : (() => () => {})(),
    options?.conflict ? ApiConflict(typeof options.conflict === 'string' ? options.conflict : undefined) : (() => () => {})(),
  );
}

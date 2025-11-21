/**
 * 配置验证模块
 * 负责对应用环境变量进行类型转换和验证，确保应用配置的正确性和安全性
 */
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, validateSync } from 'class-validator';
import { ConfigFactory } from '@nestjs/config';

/**
 * 应用环境枚举
 * 定义系统支持的不同运行环境
 */
enum Environment {
  Development = 'development', // 开发环境
  Staging = 'staging',         // 预发布环境
  Production = 'production',   // 生产环境
}

/**
 * 环境变量验证类
 * 使用class-validator装饰器定义各环境变量的类型和验证规则
 */
class EnvironmentVariables {
  /** 应用运行环境 */
  @IsEnum(Environment)          // 必须是Environment枚举中的值
  @IsOptional()                 // 可选参数，有默认值
  APP_ENV: Environment = Environment.Development;

  /** 应用监听端口 */
  @IsInt()                      // 必须是整数
  @IsOptional()                 // 可选参数，有默认值
  APP_PORT = 3000;

  /** 应用监听主机 */
  @IsString()                   // 必须是字符串
  @IsOptional()                 // 可选参数，有默认值
  APP_HOST = '0.0.0.0';

  /** API路径前缀 */
  @IsString()                   // 必须是字符串
  @IsOptional()                 // 可选参数，有默认值
  APP_PREFIX = 'api/v1';

  /** 应用名称 */
  @IsString()                   // 必须是字符串
  APP_NAME = 'Campus Management System';

  /** 应用版本 */
  @IsString()                   // 必须是字符串
  APP_VERSION = '1.0.0';

  /** 数据库连接URL */
  @IsString()                   // 必须是字符串
  DATABASE_URL!: string;         // 必需参数，无默认值
}

/**
 * 配置验证工厂函数
 * 将process.env转换为验证过的配置对象，确保所有必要的环境变量都存在且格式正确
 * @returns 验证通过的配置对象
 * @throws Error 当环境变量验证失败时抛出错误
 */
export const validateConfig: ConfigFactory<Record<string, unknown>> = (env = process.env) => {
  // 预处理环境变量，确保类型正确
  const processedEnv = {
    ...env,
    // 确保 APP_PORT 为数字类型
    APP_PORT: env.APP_PORT ? parseInt(env.APP_PORT, 10) : 3000,
  };

  // 将环境变量转换为EnvironmentVariables实例，启用隐式类型转换
  const validatedConfig = plainToInstance(EnvironmentVariables, processedEnv, {
    enableImplicitConversion: true,
  });

  // 验证配置对象，不跳过缺失的属性
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  // 如果有验证错误，抛出异常
  if (errors.length > 0) {
    console.error('配置验证错误:', errors);
    throw new Error(errors.toString());
  }

  // 返回验证通过的配置对象，确保类型正确
  return validatedConfig as unknown as Record<string, unknown>;
};
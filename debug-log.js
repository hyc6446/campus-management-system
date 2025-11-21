// 调试日志输出的中文显示问题
const fs = require('fs');
const pino = require('pino');

console.log('=== 开始调试日志中文显示问题 ===\n');

// 1. 测试console.log的中文显示
console.log('【测试1】使用console.log直接输出中文:');
console.log('MinIO服务模块初始化');
console.log('存储桶 campus-files 已存在');
console.log();

// 2. 测试pino的中文显示
console.log('【测试2】使用pino输出中文:');
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: false,
      singleLine: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      outputEncoding: 'utf8',
      messageFormat: '{msg}'
    }
  }
});

logger.info('MinIO服务模块初始化');
logger.info('存储桶 campus-files 已存在');
console.log();

// 3. 测试不带transport的pino
console.log('【测试3】使用pino（不带pretty）输出中文:');
const rawLogger = pino({
  level: 'info',
  destination: process.stdout
});

rawLogger.info('MinIO服务模块初始化');
rawLogger.info('存储桶 campus-files 已存在');
console.log();

// 4. 测试stdout编码设置
console.log('【测试4】设置stdout编码后再使用pino:');
process.stdout.setEncoding('utf8');
const encodedLogger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: false,
      singleLine: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      outputEncoding: 'utf8',
      messageFormat: '{msg}'
    }
  }
});

encodedLogger.info('MinIO服务模块初始化');
encodedLogger.info('存储桶 campus-files 已存在');
console.log();

// 5. 测试同步vs异步输出顺序
console.log('【测试5】测试同步vs异步输出顺序:');
console.log('这是console.log输出(同步)');
logger.info('这是pino输出(异步)');
console.log('这是另一个console.log输出(同步)');

console.log('\n=== 调试完成 ===');

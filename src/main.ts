import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@core/logger/logger.service';
import { setupSwagger } from '@core/swagger/swagger-config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { PrismaService } from '@core/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);
  const prismaService = app.get(PrismaService);

  // 全局前缀
  const globalPrefix = configService.get('app.prefix');
  app.setGlobalPrefix(globalPrefix);

  // 全局日志 - 使用我们封装的LoggerService，保持日志一致性
  app.useLogger(app.get(LoggerService));

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));

  // 全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 移除全局验证管道，项目使用的是局部Zod验证管道
  // 全局验证管道与Zod验证管道冲突，会导致重复验证

  // Swagger文档
  setupSwagger(app, configService);

  // 启用关机钩子
  prismaService.enableShutdownHooks(app);

  // CORS配置
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = configService.get('app.port');
  const host = configService.get('app.host');
  
  await app.listen(port, host, () => {
    loggerService.log(
      `🚀 Application is running on: http://${host}:${port}/${globalPrefix}`,
      'Bootstrap',
    );
    
    const swaggerEnabled = configService.get('swagger.enabled');
    const swaggerPath = configService.get('swagger.path');
    if (swaggerEnabled) {
      loggerService.log(
        `📚 API documentation available at: http://${host}:${port}/${swaggerPath}`,
        'Bootstrap',
      );
    }
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
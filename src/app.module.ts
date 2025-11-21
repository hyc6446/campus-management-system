import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { LoggerModule } from '@core/logger/logger.module';
import { LoggerService } from '@core/logger/logger.service';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { ZodValidationPipe } from '@common/pipes/validation.pipe';
import { PrismaModule } from '@core/prisma/prisma.module';
import { MinioModule } from '@core/minio/minio.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateConfig } from '@config/configuration';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import minioConfig from '@config/minio.config';
import swaggerConfig from '@config/swagger.config';
import loggerConfig from '@config/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [validateConfig, appConfig, databaseConfig, minioConfig, swaggerConfig, loggerConfig],
      envFilePath: ['.env'],
    }),
    LoggerModule,
    PrismaModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ZodValidationPipe(
        // 为全局管道提供一个基本schema，通常在控制器级别会覆盖
        require('zod').object({}),
      ),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  getEnv() {
    return this.configService.get('app');
  }
}
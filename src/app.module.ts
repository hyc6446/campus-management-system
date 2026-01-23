import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod'
// 导入模块
import { AuthCoreModule } from '@core/auth/auth.module'
import { CaslModule } from '@core/casl/casl.module'
import { LoggerModule } from '@core/logger/logger.module'
import { PrismaModule } from '@core/prisma/prisma.module'
import { MinioModule } from '@core/minio/minio.module'
import { CaslGuard } from '@core/casl/casl.guard'
// 导入模块
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/user/user.module'
import { AuditLogModule } from '@modules/auditLog/auditLog.module'
import { RuleConfigModule } from '@modules/rule-config/rule-config.module'

// 导入模块
import { HttpExceptionFilter } from '@common/filters/http-exception.filter'
import { TransformInterceptor } from '@common/interceptors/transform.interceptor'
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor'
import { AuditLogInterceptor } from '@common/interceptors/audit-log.interceptor'
import { AuthGuard } from '@common/guards/auth.guard'
import { RolesGuard } from '@common/guards/roles.guard'

import { AppController } from './app.controller'
import { AppService } from './app.service'

// 导入配置验证函数
import { validateConfig } from '@config/configuration'
import authConfig from '@config/auth.config'
import appConfig from '@config/app.config'
import databaseConfig from '@config/database.config'
import minioConfig from '@config/minio.config'
import swaggerConfig from '@config/swagger.config'
import loggerConfig from '@config/logger.config'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        validateConfig,
        appConfig,
        databaseConfig,
        minioConfig,
        swaggerConfig,
        loggerConfig,
        authConfig,
      ],
      envFilePath: ['.env'],
    }),
    // 限流模块
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: Number(config.get('THROTTLE_TTL', 60)),
            limit: Number(config.get('THROTTLE_LIMIT', 10)),
          },
        ],
      }),
    }),
    // 核心模块
    LoggerModule,
    PrismaModule,
    MinioModule,
    AuthCoreModule,
    CaslModule,
    // 业务模块
    AuthModule,
    UserModule,
    AuditLogModule,
    RuleConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局限流
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: CaslGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  getEnv() {
    return this.configService.get('app')
  }
}

import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { LoggerModule as NestPinoLoggerModule } from 'nestjs-pino'

/**
 * LoggerModule类
 * 配置并注册日志相关服务
 * - 直接使用nestjs-pino模块
 * - nestjs-pino模块会自动注册PinoLogger供其他模块使用
 */
@Global()
@Module({
  imports: [
    // 通过配置服务动态获取配置
    NestPinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const loggerConfig = configService.get('logger')
        return {
          pinoHttp: {
            // 自定义序列化器，控制日志输出格式
            // serializers: {
            //   req(req) {
            //     return {
            //       method: req.method,
            //       url: req.url,
            //       headers: req.headers,
            //       remoteAddress: req.remoteAddress,
            //     }
            //   },
            //   res(res) {
            //     return {
            //       statusCode: res.statusCode,
            //       headers: res.headers,
            //     }
            //   },
            // },
            // 自定义属性，添加额外的上下文信息
            customProps: (req, res) => {
              return {
                context: 'HTTP',
                requestId: req.id,
              }
            },
            transport: loggerConfig.prettyPrint
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    timestampKey: 'time',
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                    // outputEncoding: 'utf8',
                    messageFormat: '{msg}',
                  },
                }
              : undefined,
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class LoggerModule {}

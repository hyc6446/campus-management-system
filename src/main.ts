import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { setupSwagger } from '@core/swagger/swagger-config'
import { AppModule } from './app.module'
import { TransformInterceptor } from '@common/interceptors/transform.interceptor'
import { PrismaService } from '@core/prisma/prisma.service'
import { SocketService } from '@core/socket/socket.service'
import { PinoLogger } from 'nestjs-pino'
import { Server } from 'socket.io'
import { createServer } from 'http'

process.env.TZ = 'Asia/Shanghai'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const prismaService = app.get(PrismaService)
  const logger = await app.resolve(PinoLogger)
  app.enableCors() // 启用CORS
  app.useGlobalInterceptors(new TransformInterceptor())
  prismaService.enableShutdownHooks(app) // 启用Prisma的关机钩子

  const globalPrefix = configService.get('app.prefix') // 全局前缀
  app.setGlobalPrefix(globalPrefix)
  setupSwagger(app, configService) // 配置Swagger文档
  const apiPort = configService.get('app.port', 3000) // API端口
  const socketPort = configService.get('app.socketPort', 3003) // Socket端口
  const host = configService.get('app.host', '127.0.0.1') // 主机地址

  // 启动API服务器
  await app.listen(apiPort, host, () => {
    logger.info(`🎉 API服务器启动成功！`)
    logger.info(`🌐 应用访问地址: http://${host}:${apiPort}/${globalPrefix}`)
    logger.info(`📚 API文档地址: http://${host}:${apiPort}/docs`)
  })

  // 创建独立的Socket服务器
  const socketHttpServer = createServer()
  const io = new Server(socketHttpServer)
  const socketService = app.get(SocketService)
  socketService.initialize(io)

  // 启动Socket服务器
  socketHttpServer.listen(socketPort, host, () => {
    logger.info(`🎉 Socket服务器启动成功！`)
    logger.info(`🔗 Socket.IO 地址: ws://${host}:${socketPort}`)
  })
}

bootstrap().catch(error => {
  console.error('❌ 服务器启动失败:', error)
  process.exit(1)
})

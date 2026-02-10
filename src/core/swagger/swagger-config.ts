import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { cleanupOpenApiDoc } from 'nestjs-zod'

export function setupSwagger(app: INestApplication, configService: ConfigService) {
  const swaggerConfig = configService.get('swagger')

  if (!swaggerConfig.enabled) return

  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return `${controllerKey.toLowerCase()}_${methodKey.toLowerCase()}`
    },
  })

  // 使用 cleanupOpenApiDoc 处理文档
  const enhancedDocument = cleanupOpenApiDoc(document)

  SwaggerModule.setup(swaggerConfig.path, app, enhancedDocument, {
    customSiteTitle: swaggerConfig.title,
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      persistAuthorization: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      displayRequestDuration: true,
    },
  })
}
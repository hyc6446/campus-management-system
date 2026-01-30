import { Module, Global, OnModuleInit } from '@nestjs/common'
import { KafkaService } from './kafka.service'
import { kafkaTopicsConfig } from './kafka-topic.config'
/**
 * Kafka模块
 * 提供Kafka服务，用于消息队列通信
 */

@Global()
@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule implements OnModuleInit {
  constructor(private kafkaService: KafkaService) {}
  async onModuleInit() {
    try {
      console.log('🔄 开始初始化 Kafka 主题...')
      if (kafkaTopicsConfig.length > 0) {
        await this.kafkaService.createTopics(kafkaTopicsConfig)
      }
    } catch (error) {
      console.error('❌ Kafka 主题初始化失败:', error)
      throw error
    }
  }
}

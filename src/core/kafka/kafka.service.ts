import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Kafka, Producer, Consumer, Admin, KafkaConfig } from 'kafkajs'
import { PinoLogger } from 'nestjs-pino'
import fs from 'fs'
import { KafkaTopicType } from './kafka-topic.config'

/**
 * Kafka服务
 * 提供Kafka生产者和消费者功能，用于消息队列通信
 */
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka
  private producer: Producer
  private consumers: Map<string, Consumer> = new Map()
  private admin: Admin

  constructor(
    private configService: ConfigService,
    private logger: PinoLogger
  ) {
    const kafkaHost = this.configService.get<string>('kafka.host', 'kafka')
    const kafkaPort = this.configService.get<number>('kafka.port', 9092)
    // const kafkaRoot = this.configService.get<string>('kafka.root', 'user')
    // const kafkaPassword = this.configService.get<string>('kafka.password', '')
    const kafkaClientId = this.configService.get<string>('kafka.clientId','')

    const kafkaConfig: KafkaConfig = {
      clientId: kafkaClientId,
      brokers: [`${kafkaHost}:${kafkaPort}`],
      ssl: false,
    }

    this.kafka = new Kafka(kafkaConfig)
    this.producer = this.kafka.producer()
    this.admin = this.kafka.admin()
  }
  /**
   * 模块初始化时调用，连接Kafka生产者和管理员
   *
   */
  async onModuleInit() {
    try {
      await this.producer.connect()
      await this.admin.connect()
      this.logger.info('Kafka连接成功')
    } catch (error) {
      this.logger.error('Kafka连接失败:', error)
    }
  }
  /**
   * 模块销毁时调用，断开Kafka生产者和管理员连接
   *
   */
  async onModuleDestroy() {
    try {
      for (const [groupId, consumer] of this.consumers) {
        await consumer.disconnect()
      }
      await this.producer.disconnect()
      await this.admin.disconnect()
      this.logger.info('Kafka连接已断开')
    } catch (error) {
      this.logger.error('Kafka连接断开失败:', error)
    }
  }

  /**
   * 发送消息到指定主题
   * @param topic 主题名称
   * @param messages 消息内容
   * @param retryAttempts 重试次数
   */
  async sendMessage(topic: KafkaTopicType, messages: any[], retryAttempts: number = 3) {
    if (!messages || messages.length === 0) return
    let attempt = 0 // 重试次数
    while (attempt < retryAttempts) {
      try {
        const formattedMsg = messages.map(msg => ({ value: JSON.stringify(msg) }))

        return await this.producer.send({ topic, messages: formattedMsg, acks: -1 })
      } catch (error) {
        attempt++
        if (attempt >= retryAttempts) {
          this.logger.error('消息发送失败，已重试多次:', error)
          throw error
        }
        this.logger.warn(`重试发送消息(第 ${attempt}/${retryAttempts} 次重试):`, error)
        // 指数退避重试
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)))
      }
    }
    throw new Error('消息发送失败，已重试多次')
  }

  /**
   * 创建并启动消费者
   * @param groupId 消费者组ID
   * @param topics 要订阅的主题列表
   * @param onMessage 消息处理函数
   * 
   */
  async createConsumer(
    groupId: string,
    topics: string[],
    onMessage: (message: any) => Promise<void>
  ) {
    const kafkaSessionTimeout = this.configService.get<number>('kafka.sessionTimeout', 30000)
    const kafkaHeartbeatInterval = this.configService.get<number>('kafka.heartbeatInterval', 10000)
    const kafkaRetries = this.configService.get<number>('kafka.retries', 3)
    const kafkaDelay = this.configService.get<number>('kafka.delay', 100)
    // 自动提交配置
    const kafkaAutoCommit = this.configService.get<boolean>('kafka.autoCommit', false)
    // 手动提交偏移量间隔
    const kafkaCommitInterval = this.configService.get<number>('kafka.commitInterval', 5000)
    // 手动提交阈值
    const kafkaThreshold = this.configService.get<number>('kafka.threshold', 100)
    try {
      // 创建Kafka消费者
      const consumer = this.kafka.consumer({
        groupId,
        sessionTimeout: kafkaSessionTimeout,
        heartbeatInterval: kafkaHeartbeatInterval,
        retry: {
          initialRetryTime: kafkaDelay,
          retries: kafkaRetries,
        },
      })

      await consumer.connect()
      await consumer.subscribe({ topics, fromBeginning: false })

      await consumer.run({
        eachMessage: async ({ topic, partition, message, heartbeat }) => {
          // 定期发送心跳，避免会话超时
          await heartbeat()

          const value = message.value?.toString()
          if (value) {
            const parsedMessage = JSON.parse(message.value?.toString() || '{}')
            await onMessage(parsedMessage)
            // 手动提交偏移量
            await consumer.commitOffsets([{ topic, partition, offset: message.offset + 1 }])
          }
        },
        autoCommit: kafkaAutoCommit,
        autoCommitInterval: kafkaCommitInterval,
        autoCommitThreshold: kafkaThreshold,
      })

      this.consumers.set(groupId, consumer)
      this.logger.info(`Kafka消费者创建成功，组ID: ${groupId}，主题: ${topics.join(', ')}`)
      return consumer
    } catch (error) {
      this.logger.error(`Kafka消费者创建失败`, error)
      throw error
    }
  }

  /**
   * 创建主题
   * @param topics 主题配置列表
   * @param numPartitions 主题的分区数
   * @param replicationFactor 主题的复制因子
   *
   * @description 创建指定的Kafka主题
   * @param topics 主题配置列表，每个元素包含主题名称、分区数和复制因子
   * @param numPartitions 主题的分区数，默认值为1
   * @param replicationFactor 主题的复制因子，默认值为1
   */
  async createTopics(
    topics: { topic: string; numPartitions?: number; replicationFactor?: number }[]
  ) {
    try {
      // 尝试列出主题，但如果失败，仍然继续尝试创建主题
      let existingTopics: string[] = []
      try {
        existingTopics = await this.admin.listTopics()
      } catch (listError) {
        this.logger.warn('Kafka主题列表获取失败,将尝试创建所有主题:', listError)
      }
      
      const topicsToCreate = topics.filter(t => !existingTopics.includes(t.topic))
      if (topicsToCreate.length > 0) {
        try {
          await this.admin.createTopics({ topics: topicsToCreate })
        } catch (createError) {
          this.logger.warn('Kafka主题创建失败,但连接已建立:', createError)
        }
      } else {
        this.logger.info('所有主题已存在，无需创建')
      }
    } catch (error) {
      this.logger.warn('Kafka主题初始化过程中出现错误，但连接已建立:', error)
      // 不抛出异常，允许应用程序继续启动
    }
  }

  /**
   * 删除消费者
   * @param groupId 消费者组ID
   */
  async removeConsumer(groupId: string) {
    try {
      const consumer = this.consumers.get(groupId)
      if (consumer) {
        await consumer.disconnect()
        this.consumers.delete(groupId)
        this.logger.info(`Kafka消费者 ${groupId} 已成功删除`)
      }
    } catch (error) {
      this.logger.error(`Kafka消费者删除失败 ${groupId}`, error)
      throw error
    }
  }
}

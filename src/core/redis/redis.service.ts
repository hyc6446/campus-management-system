import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'
import { PinoLogger } from 'nestjs-pino'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis

  constructor(
    private configService: ConfigService,
    private readonly logger: PinoLogger
  ) {
    const redisConfig = {
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
      password: this.configService.get<string>('REDIS_PASSWORD', ''),
      db: this.configService.get<number>('REDIS_DB', 0),
    }
    this.redisClient = new Redis(redisConfig)
  }
  async onModuleInit() {
    try {
      await this.redisClient.ping()
      this.logger.info('Redis连接成功')
    } catch (error) {
      this.logger.error('Redis连接失败:', error)
    }
  }
  async onModuleDestroy() {
    await this.redisClient.quit()
    this.logger.info('Redis连接已关闭')
  }
  // 获取原始客户端（用于复杂操作）
  async getClient(): Promise<Redis> {
    return this.redisClient
  }
  /**
   * Redis 操作方法
   *
   */
  // 字符串操作方法
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value)
    if (ttl) {
      await this.redisClient.set(key, serializedValue, 'EX', ttl)
    } else {
      await this.redisClient.set(key, serializedValue)
    }
  }
  async get(key: string): Promise<any> {
    const value = await this.redisClient.get(key)
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key)
  }
  async flush(): Promise<void> {
    await this.redisClient.flushall()
  }
  async exists(key: string): Promise<boolean> {
    const exists = await this.redisClient.exists(key)
    return exists > 0
  }
  // 哈希操作方法
  async hset(key: string, field: string, value: any): Promise<void> {
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value)
    await this.redisClient.hset(key, field, serializedValue)
  }
  async hget(key: string, field: string): Promise<any> {
    const value = await this.redisClient.hget(key, field)
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
  async hgetall(key: string): Promise<Record<string, any>> {
    const values = await this.redisClient.hgetall(key)
    const result: Record<string, any> = {}

    for (const [field, value] of Object.entries(values)) {
      try {
        result[field] = JSON.parse(value)
      } catch {
        result[field] = value
      }
    }
    return result
  }
  async hdel(key: string, field: string): Promise<void> {
    await this.redisClient.hdel(key, field)
  }
  // 列表操作
  async lpush(key: string, ...values: any[]): Promise<void> {
    const stringValues = values.map(v => (typeof v === 'string' ? v : JSON.stringify(v)))
    await this.redisClient.lpush(key, ...stringValues)
  }

  async rpush(key: string, ...values: any[]): Promise<void> {
    const stringValues = values.map(v => (typeof v === 'string' ? v : JSON.stringify(v)))
    await this.redisClient.rpush(key, ...stringValues)
  }

  async lrange(key: string, start: number, stop: number): Promise<any[]> {
    const values = await this.redisClient.lrange(key, start, stop)
    return values.map(v => {
      try {
        return JSON.parse(v)
      } catch {
        return v
      }
    })
  }

  // 集合操作
  async sadd(key: string, ...members: any[]): Promise<void> {
    const stringMembers = members.map(m => (typeof m === 'string' ? m : JSON.stringify(m)))
    await this.redisClient.sadd(key, ...stringMembers)
  }

  async sismember(key: string, member: any): Promise<boolean> {
    const stringMember = typeof member === 'string' ? member : JSON.stringify(member)
    const result = await this.redisClient.sismember(key, stringMember)
    return result === 1
  }

  async smembers(key: string): Promise<any[]> {
    const members = await this.redisClient.smembers(key)
    return members.map(m => {
      try {
        return JSON.parse(m)
      } catch {
        return m
      }
    })
  }

  // 有序集合操作
  async zadd(key: string, score: number, member: any): Promise<void> {
    const stringMember = typeof member === 'string' ? member : JSON.stringify(member)
    await this.redisClient.zadd(key, score, stringMember)
  }

  async zrange(key: string, start: number, stop: number): Promise<any[]> {
    const members = await this.redisClient.zrange(key, start, stop)
    return members.map(m => {
      try {
        return JSON.parse(m)
      } catch {
        return m
      }
    })
  }
  async zrem(key: string, member: any): Promise<void> {
    const stringMember = typeof member === 'string' ? member : JSON.stringify(member)
    await this.redisClient.zrem(key, stringMember)
  }

  // Stream 操作方法
  /**
   * 向Stream中添加消息
   * @param key Stream键名
   * @param id 消息ID，默认值为'*'，表示自动生成ID
   * @param fields 消息字段，键值对形式，值可以是字符串或对象
   * @returns 消息ID或null
   */
  async xadd(key: string, id: string = '*', fields: Record<string, any>): Promise<string | null> {
    const stringFields: Record<string, string> = {}
    for (const [field, value] of Object.entries(fields)) {
      stringFields[field] = typeof value === 'string' ? value : JSON.stringify(value)
    }
    const flatFields = Object.entries(stringFields).flat() as [string, string, ...string[]]
    return await this.redisClient.xadd(key, id, ...flatFields)
  }

  /**
   * 从Stream中读取消息
   * @param streams 要读取的Stream键值对，键为Stream名称，值为读取位置
   * @param options 读取选项，包括count（读取消息数量）和block（阻塞时间）
   * @returns 读取到的消息数组
   */
  async xread(
    streams: Record<string, string>,
    options?: { count?: number; block?: number }
  ): Promise<any[]> {
    const keys = Object.keys(streams)
    const values = keys.map(k => streams[k])

    if (options?.count !== undefined && options?.block !== undefined) {
      const result = await this.redisClient.xread(
        'COUNT',
        String(options.count),
        'BLOCK',
        String(options.block),
        'STREAMS',
        ...keys,
        ...values
      )
      return this.parseStreamMessages(result)
    } else if (options?.count !== undefined) {
      const result = await this.redisClient.xread(
        'COUNT',
        String(options.count),
        'STREAMS',
        ...keys,
        ...values
      )
      return this.parseStreamMessages(result)
    } else if (options?.block !== undefined) {
      const result = await this.redisClient.xread(
        'BLOCK',
        String(options.block),
        'STREAMS',
        ...keys,
        ...values
      )
      return this.parseStreamMessages(result)
    } else {
      const result = await this.redisClient.xread('STREAMS', ...keys, ...values)
      return this.parseStreamMessages(result)
    }
  }

  /**
   * 从Stream中读取消息
   * @param group 消费组名称
   * @param consumer 消费者名称
   * @param streams 要读取的Stream键值对，键为Stream名称，值为读取位置
   * @param options 读取选项，包括count（读取消息数量）和block（阻塞时间）
   * @returns 读取到的消息数组
   */
  async xreadgroup(
    group: string,
    consumer: string,
    streams: Record<string, string>,
    options?: { count?: number; block?: number }
  ): Promise<any[]> {
    const keys = Object.keys(streams)
    const values = keys.map(k => streams[k])

    if (options?.count !== undefined && options?.block !== undefined) {
      const result = await this.redisClient.xreadgroup(
        'GROUP',
        group,
        consumer,
        'COUNT',
        String(options.count),
        'BLOCK',
        String(options.block),
        'STREAMS',
        ...keys,
        ...values
      )
      return this.parseStreamMessages(result)
    } else if (options?.count !== undefined) {
      const result = await this.redisClient.xreadgroup(
        'GROUP',
        group,
        consumer,
        'COUNT',
        String(options.count),
        'STREAMS',
        ...keys,
        ...values
      )
      return this.parseStreamMessages(result)
    } else if (options?.block !== undefined) {
      const result = await this.redisClient.xreadgroup(
        'GROUP',
        group,
        consumer,
        'BLOCK',
        String(options.block),
        'STREAMS',
        ...keys,
        ...values
      )
      return this.parseStreamMessages(result)
    } else {
      const result = await this.redisClient.xreadgroup(
        'GROUP',
        group,
        consumer,
        'STREAMS',
        ...keys,
        ...values
      )
      return this.parseStreamMessages(result)
    }
  }

  /**
   * 创建Stream消费组
   * @param key Stream键名
   * @param group 消费组名称
   * @param id 初始读取位置，默认值为'0'
   */
  async xgroupCreate(key: string, group: string, id: string = '0'): Promise<void> {
    try {
      await this.redisClient.xgroup('CREATE', key, group, id, 'MKSTREAM')
    } catch (error: any) {
      if (error.message.includes('BUSYGROUP')) return;
      throw error;
    }
  }
  
  /**
   * 确认已处理消息
   * @param key Stream键名
   * @param group 消费组名称
   * @param ids 已处理消息ID列表
   */
  async xack(key: string, group: string, ...ids: string[]): Promise<void> {
    await this.redisClient.xack(key, group, ...ids);
  }

  /**
   * 获取未处理消息
   * @param key Stream键名
   * @param group 消费组名称
   * @returns 未处理消息列表
   */
  async xpending(key: string, group: string): Promise<any> {
    return await this.redisClient.xpending(key, group)
  }

  /**
   * 重新分配未处理消息
   * @param key Stream键名
   * @param group 消费组名称
   * @param consumer 消费者名称
   * @param minIdleTime 最小空闲时间（毫秒）
   * @param ids 未处理消息ID列表
   * @returns 重新分配的消息数组
   */
  async xclaim(
    key: string,
    group: string,
    consumer: string,
    minIdleTime: number,
    ...ids: string[]
  ): Promise<any[]> {
    const result = await this.redisClient.xclaim(key, group, consumer, minIdleTime, ...ids)
    return this.parseStreamMessages([[key, result]])
  }

  /**
   * 删除已处理消息
   * @param key Stream键名
   * @param ids 已处理消息ID列表
   * @returns 删除的消息数量
   */
  async xdel(key: string, ...ids: string[]): Promise<number> {
    return await this.redisClient.xdel(key, ...ids)
  }

  /**
   * 解析Stream消息
   * @param result 原始消息数组
   * @returns 解析后的消息数组
   */
  private parseStreamMessages(result: any): any[] {
    if (!result) return []

    return result.map((stream: any) => {
      const [streamName, messages] = stream
      return {
        stream: streamName,
        messages: messages.map((msg: any) => {
          const [id, fields] = msg
          const parsedFields: Record<string, any> = {}
          for (const [key, value] of Object.entries(fields)) {
            try {
              parsedFields[key] = JSON.parse(String(value))
            } catch {
              parsedFields[key] = value
            }
          }
          return { id, ...parsedFields }
        }),
      }
    })
  }

  // 过期时间操作
  async expire(key: string, seconds: number): Promise<void> {
    await this.redisClient.expire(key, seconds)
  }

  async ttl(key: string): Promise<number> {
    return await this.redisClient.ttl(key)
  }

  // 事务操作
  async multi(operations: () => Promise<any>): Promise<any> {
    const pipeline = this.redisClient.pipeline()
    const result = await operations()
    return await pipeline.exec()
  }
}

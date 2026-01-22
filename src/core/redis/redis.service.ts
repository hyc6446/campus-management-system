import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis

  constructor(private configService: ConfigService) {
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
      console.log('Redis connected successfully')
    } catch (error) {
      console.error('Redis connection failed:', error)
    }
  }
  async onModuleDestroy() {
    await this.redisClient.quit()
    console.log('Redis connection closed')
  }
  // 获取原始客户端（用于复杂操作）
  getClient(): Redis {
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

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { RedisService } from '@app/core/redis/redis.service'
import { AuthService } from '@app/core/auth/auth.service'
import { PinoLogger } from 'nestjs-pino'
import { AUTH_STREAM_KEY } from '@app/common/constants/redis.constants'
import * as pt from '@app/common/prisma-types'

interface ConnectedUser {
  socketId: string
  userId: number
  user: pt.USER_SAFE_ROLE_DEFAULT_TYPE
  joinedAt: Date
  subscriptions: Set<string>
}

@Injectable()
export class SocketService implements OnModuleInit, OnModuleDestroy {
  private server: Server | null = null
  // 已连接用户映射
  private connectedUsers: Map<string, ConnectedUser> = new Map()
  // 用户Socket映射
  private userSockets: Map<number, string[]> = new Map()
  private readonly Auth_Stream = AUTH_STREAM_KEY
  private readonly Group_Stream = 'group:stream'
  private readonly Group = 'campus:group'
  private isRunning = true

  constructor(
    private readonly logger: PinoLogger,
    private readonly authService: AuthService,
    private readonly redisService: RedisService
  ) {}
  // 初始化Socket服务
  onModuleInit() {
    this.isRunning = true
    this.logger.info('Socket服务初始化')
  }
  // 销毁Socket服务
  onModuleDestroy() {
    this.logger.info('Socket服务销毁')
    this.isRunning = false
    if (this.server) {
      this.server.close()
    }
  }

  // 初始化Socket服务器
  initialize(server: Server) {
    this.server = server
    this.setupEventHandlers()
    this.startStreamListener()
    this.logger.info('Socket服务初始化完成')
  }

  // 设置Socket事件处理器
  private setupEventHandlers() {
    if (!this.server) return false
    // 监听连接事件
    this.server.on('connection', (socket: Socket) => {
      this.logger.info(`Socket连接成功: ${socket.id}`)
      // 监听断开连接事件
      socket.on('disconnect', () => this.handleDisconnect(socket))
      // 监听心跳事件
      socket.on('ping', () => socket.emit('pong'))
      // 监听认证事件
      socket.on('authenticate', (data: { token: string }, callback) =>
        this.handleAuthenticate(socket, data, callback)
      )
      // 监听订阅事件
      socket.on('subscribe', (data: { topic: string }, callback) =>
        this.handleSubscribe(socket, data, callback)
      )
      // 监听取消订阅事件
      socket.on('unsubscribe', (data: { topic: string }, callback) =>
        this.handleUnsubscribe(socket, data, callback)
      )
    })
    return true
  }

  /**
   * 处理断开连接事件
   * @param socket Socket实例
   */
  async handleDisconnect(socket: Socket) {
    const { id: socketId } = socket
    // 1. 验证用户是否存在且已认证
    const connectedUser = this.connectedUsers.get(socketId)
    if (!connectedUser) {
      this.logger.warn(`用户 ${socketId} 未认证或不存在`)
      return
    }
    const { userId } = connectedUser
    const userSocketIds = this.userSockets.get(userId)
    if (!userSocketIds) return false
    // 2. 从用户Socket映射中移除当前Socket
    const updatedUserSockets = userSocketIds.filter(id => id !== socketId)
    if (updatedUserSockets.length === 0) this.userSockets.delete(userId)
    this.userSockets.set(userId, updatedUserSockets)
    // 3. 从已连接用户映射中移除当前用户
    this.connectedUsers.delete(socketId)
    this.logger.info(`用户 ${userId} 断开连接: ${socketId}`)
    return true
  }

  /**
   * 处理认证事件
   * @param socket Socket实例
   * @param data 认证数据
   */
  async handleAuthenticate(
    socket: Socket,
    data: { token: string },
    callback: (error: any, success?: boolean) => void
  ) {
    const { token } = data
    const { id: socketId } = socket
    // 1.验证用户是否存在且已认证
    const user = await this.authService.validateToken(token)
    if (!user) {
      socket.emit('unauthenticated', { message: '用户未认证' })
      socket.disconnect()
      callback({ status: 'received', message: '用户不存在' })
      return
    }
    const userId = user.id
    // 2.存储连接信息
    const connectedUser: ConnectedUser = {
      socketId,
      userId,
      user,
      joinedAt: new Date(),
      subscriptions: new Set(),
    }
    // 3.储存连接对象
    this.connectedUsers.set(socketId, connectedUser)

    // 4.储存用户Socket映射
    const userSockets = this.userSockets.get(userId) || []
    userSockets.push(socketId)
    this.userSockets.set(userId, userSockets)
    // 5.加入订阅房间
    await this.joinRoom(socket, `role_${user.role}_room`)
    // 6.发送认证成功事件
    socket.emit('authenticated', { message: '认证成功' })
  }

  // 处理订阅（room）事件
  async handleSubscribe(
    socket: Socket,
    data: { topic: string },
    callback: (error: any, success?: boolean) => void
  ) {
    const { topic } = data
    const { id: socketId } = socket

    // 1.验证用户是否存在且已认证
    const connectedUser = this.connectedUsers.get(socketId)
    if (!connectedUser) {
      socket.emit('unauthenticated', { message: '用户未认证' })
      callback({ status: 'received', message: '用户未认证' })
      socket.disconnect()
      return
    }
    // 2.验证用户是否已订阅该主题（room）
    if (connectedUser.subscriptions.has(topic)) {
      socket.emit('already_subscribed', { message: '用户已订阅该主题' })
      return
    }
    // 3. 加入主题房间
    await this.joinRoom(socket, topic)
    // 4. 设置用户订阅主题映射
    connectedUser.subscriptions.add(topic)

    this.logger.info(`用户 ${connectedUser.userId} 订阅主题 ${topic}`)
  }

  // 处理取消订阅事件
  async handleUnsubscribe(
    socket: Socket,
    data: { topic: string },
    callback: (error: any, success?: boolean) => void
  ) {
    const { topic } = data
    const { id: socketId } = socket

    // 1.验证用户是否存在且已认证
    const connectedUser = this.connectedUsers.get(socketId)
    if (!connectedUser) {
      socket.emit('unauthenticated', { message: '用户未认证' })
      callback({ status: 'received', message: '用户未认证' })
      socket.disconnect()
      return
    }
    // 2.验证用户是否订阅了该主题
    if (!connectedUser.subscriptions.has(topic)) {
      socket.emit('not_subscribed', { message: '用户未订阅该主题' })
      return
    }
    // 3. 离开主题房间
    await this.leaveRoom(socket, topic)
    connectedUser.subscriptions.delete(topic)
    this.logger.info(`用户 ${connectedUser.userId} 取消订阅主题 ${topic}`)
  }
  /**
   * 加入房间
   * @param socket Socket实例
   * @param roomName 房间名称
   */
  async joinRoom(socket: Socket, topic: string) {
    if (!this.server) return false
    // 加入房间
    socket.join(topic)
    this.logger.info('订阅成功')
    return true
  }
  /**
   * 离开房间
   * @param socket Socket实例
   * @param topic 主题名称
   */
  async leaveRoom(socket: Socket, topic: string) {
    if (!this.server) return false
    socket.leave(topic)
    this.logger.info('取消订阅成功')
    return true
  }

  /**
   * 向指定用户发送事件
   * @param userId 用户ID
   * @param event 事件名称
   * @param data 消息数据
   */
  async emitToUser(userId: number, event: string, data: any) {
    // 1. 服务是否初始化
    if (!this.server) return false
    // 2. 用户是否有连接
    const socketIds = this.userSockets.get(userId)
    if (!socketIds) return false
    // 3. 发送事件
    socketIds.forEach(socketId => {
      this.server!.to(socketId).emit(event, data)
    })
    return true
  }

  /**
   * 向多个用户发送事件
   * @param userIds 用户ID列表
   * @param event 事件名称
   * @param data 消息数据
   */
  async emitToUsers(userIds: number[], event: string, data: any) {
    await Promise.all(userIds.map(userId => this.emitToUser(userId, event, data)))
    return true
  }

  /**
   * 向所有用户发送事件
   * @param event 事件名称
   * @param data 消息数据
   */
  async emitToAll(event: string, data: any) {
    if (!this.server) return false
    console.log('emitToAll', event, data)
    this.server.emit(event, data)
    return true
  }

  /**
   * 向指定房间发送事件
   * @param room 房间名称
   * @param event 事件名称
   * @param data 消息数据
   */
  async emitToRoom(room: string, event: string, data: any) {
    if (!this.server) return false
    this.server.to(room).emit(event, data)
    return true
  }

  /**
   * 获取当前连接的用户数量
   * @returns 连接的用户数量
   */
  getConnectedUserCount(): number {
    if (!this.server) return 0
    return this.userSockets.size
  }

  startStreamListener() {
    // 使用非阻塞方式启动Stream监听器
    this.listenToStream().catch(error => {
      this.logger.error('Stream 监听失败:', error)
    })
  }
  private async listenToStream() {
    try {
      // 确保创建消费组
      await this.redisService.xgroupCreate(this.Auth_Stream, this.Group, '0')
      this.logger.info(`创建消费组 ${this.Group} 成功`)
    } catch (error) {
      this.logger.warn('创建消费组失败（可能已存在）:', error)
    }

    try {
      while (this.isRunning) {
        const messages = await this.redisService.xreadgroup(
          this.Group, // 消费组名称
          'consumer-1', // 消费者名称
          { [this.Auth_Stream]: '>' }, // Stream键值对
          { count: 2, block: 5000 } // 选项
        )
        if (messages) {
          messages.forEach(async msg => {
            msg.messages.forEach(async (item: any) => {
              try {
                switch (item.target) {
                  case 'user':
                    await this.emitToUser(item.id, item.event, item.data)
                    break
                  case 'users':
                    await this.emitToUsers(item.users, item.event, item.data)
                    break
                  case 'room':
                    await this.emitToRoom(item.roomId, item.event, item.data)
                    break
                  default:
                    console.log('item.id==', item.id)
                    await this.emitToAll(item.event, item.data)
                    break
                }
                // 确认消息处理
                await this.redisService.xack(this.Auth_Stream, this.Group, item.id)
              } catch (msgError) {
                this.logger.error('处理消息失败:', msgError)
              }
            })
          })
        }
      }
    } catch (readError) {
      this.logger.warn('读取Stream消息失败:', readError)
      // 短暂延迟后重试
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

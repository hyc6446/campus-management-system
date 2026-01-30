import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { User } from '@app/modules/user/user.entity'
import { RedisService } from '@app/core/redis/redis.service'
import { PinoLogger } from 'nestjs-pino'
import { AUTH_STREAM_KEY } from '@app/common/constants/redis.constants'

interface ConnectedUser {
  socketId: string
  userId: number
  user: User
  joinedAt: Date
}

@Injectable()
export class SocketService {
  private server: Server | null = null
  private connectedUsers: Map<string, ConnectedUser> = new Map()
  private userSockets: Map<number, string[]> = new Map() // userId -> socketIds
  private readonly Auth_Stream = AUTH_STREAM_KEY

  /**
   * 构造函数 - 初始化SocketService
   * @param logger PinoLogger实例
   */
  constructor(
    private readonly logger: PinoLogger,
    private readonly redisService: RedisService
  ) {}

  /**
   * 初始化Socket服务器
   * @param server Socket.IO服务器实例
   */
  initialize(server: Server) {
    this.server = server
    this.setupEventHandlers()
    this.startStreamListener()
    this.logger.info('Socket服务初始化完成')
  }

  /**
   * 设置Socket事件处理器
   */
  private setupEventHandlers() {
    if (!this.server) return

    this.server.on('connection', (socket: Socket) => {
      this.logger.info(`Socket连接成功: ${socket.id}`)

      // 监听用户认证
      socket.on('authenticate', (data: { userId: number; user: User }) => {
        this.handleAuthentication(socket, data)
      })

      // 监听断开连接
      socket.on('disconnect', () => {
        this.handleDisconnect(socket)
      })

      // 监听心跳
      socket.on('ping', () => {
        socket.emit('pong')
      })
    })
  }

  /**
   * 处理用户认证
   * @param socket Socket实例
   * @param data 认证数据
   */
  private handleAuthentication(socket: Socket, data: { userId: number; user: User }) {
    const { userId, user } = data

    // 存储连接信息
    const connectedUser: ConnectedUser = {
      socketId: socket.id,
      userId,
      user,
      joinedAt: new Date(),
    }

    this.connectedUsers.set(socket.id, connectedUser)

    // 存储用户的Socket连接
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, [])
    }
    this.userSockets.get(userId)?.push(socket.id)
    this.logger.info(`用户 ${userId} 认证成功，Socket ID: ${socket.id}`)

    // 发送认证成功事件
    socket.emit('authenticated', { socketId: socket.id, userId, message: '用户认证成功' })
  }

  /**
   * 处理断开连接
   * @param socket Socket实例
   */
  private handleDisconnect(socket: Socket) {
    const connectedUser = this.connectedUsers.get(socket.id)

    if (connectedUser) {
      const { userId } = connectedUser

      // 从用户的Socket连接列表中移除
      const userSocketIds = this.userSockets.get(userId)
      if (userSocketIds) {
        const updatedSocketIds = userSocketIds.filter(id => id !== socket.id)
        if (updatedSocketIds.length > 0) {
          this.userSockets.set(userId, updatedSocketIds)
        } else {
          this.userSockets.delete(userId)
        }
      }

      // 移除连接信息
      this.connectedUsers.delete(socket.id)

      this.logger.info(`用户 ${userId} 从Socket ${socket.id} 断开连接`)
    } else {
      this.logger.info(`Socket ${socket.id} 断开连接 (未认证)`)
    }
  }

  /**
   * 向指定用户发送消息
   * @param userId 用户ID
   * @param event 事件名称
   * @param data 消息数据
   */
  async emitToUser(userId: number, event: string, data: any) {
    if (!this.server) {
      this.logger.error('Socket服务未初始化')
      return false
    }

    const socketIds = this.userSockets.get(userId)
    if (socketIds) {
      socketIds.forEach(socketId => {
        this.server!.to(socketId).emit(event, data)
      })
      return true
    }
    return false
  }

  /**
   * 向多个用户发送消息
   * @param userIds 用户ID列表
   * @param event 事件名称
   * @param data 消息数据
   */
  async emitToUsers(userIds: number[], event: string, data: any) {
    for (const userId of userIds) {
      await this.emitToUser(userId, event, data)
    }
  }

  /**
   * 向所有连接的用户发送消息
   * @param event 事件名称
   * @param data 消息数据
   */
  async emitToAll(event: string, data: any) {
    if (!this.server) {
      this.logger.error('Socket服务未初始化')
      return false
    }
    this.server.emit(event, data)
    return true
  }

  /**
   * 向指定房间发送消息
   * @param room 房间名称
   * @param event 事件名称
   * @param data 消息数据
   */
  async emitToRoom(room: string, event: string, data: any) {
    if (!this.server) {
      this.logger.error('Socket服务未初始化')
      return false
    }
    this.server.to(room).emit(event, data)
    return true
  }

  /**
   * 将用户加入房间
   * @param userId 用户ID
   * @param room 房间名称
   */
  async joinRoom(userId: number, room: string) {
    if (!this.server) {
      this.logger.error('Socket服务未初始化')
      return false
    }

    const socketIds = this.userSockets.get(userId)
    if (socketIds) {
      socketIds.forEach(socketId => {
        this.server!.sockets.sockets.get(socketId)?.join(room)
      })
      return true
    }
    return false
  }

  /**
   * 将用户移出房间
   * @param userId 用户ID
   * @param room 房间名称
   */
  async leaveRoom(userId: number, room: string) {
    if (!this.server) {
      this.logger.error('Socket服务未初始化')
      return false
    }

    const socketIds = this.userSockets.get(userId)
    if (socketIds) {
      socketIds.forEach(socketId => {
        this.server!.sockets.sockets.get(socketId)?.leave(room)
      })
      return true
    }
    return false
  }

  /**
   * 获取连接的用户数
   */
  getConnectedUserCount(): number {
    return this.userSockets.size
  }

  /**
   * 获取指定用户的连接状态
   * @param userId 用户ID
   */
  isUserConnected(userId: number): boolean {
    return this.userSockets.has(userId)
  }

  /**
   * 获取所有连接的用户信息
   */
  getConnectedUsers(): Array<{ userId: number; socketIds: string[] }> {
    const result: Array<{ userId: number; socketIds: string[] }> = []
    this.userSockets.forEach((socketIds, userId) => {
      result.push({ userId, socketIds })
    })
    return result
  }

  /**
   * 监听 Redis Stream 推送消息
   */
  startStreamListener() {
    // 使用非阻塞方式启动Stream监听器
    this.listenToStream().catch(error => {
      this.logger.error('Stream 监听失败:', error)
    })
  }

  /**
   * 内部方法：监听Stream消息
   */
  private async listenToStream() {
    try {
      while (true) {
        try {
          // 使用较短的block时间，避免长时间阻塞事件循环
          const messages = await this.redisService.xread({ [this.Auth_Stream]: '$' }, { block: 1000 })
          if (messages) {
            messages.forEach(async msg => {
              try {
                const { id, ...data } = msg.messages[0]
                await this.emitToAll(data.event, data.data)
              } catch (msgError) {
                this.logger.error('处理Stream消息失败:', msgError)
              }
            })
          }
        } catch (readError) {
          this.logger.warn('读取Stream消息失败:', readError)
          // 短暂延迟后重试
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    } catch (error) {
      this.logger.error('Stream 监听失败:', error)
      // 发生严重错误时，延迟后重新启动监听器
      setTimeout(() => this.listenToStream(), 5000)
    }
  }
}

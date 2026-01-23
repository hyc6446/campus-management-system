import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateUserDto, UpdateUserDto } from './dto/index'
import type { Prisma, User } from '@prisma/client'

import * as pt from '@app/common/prisma-types';
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService, private configService: ConfigService) {}

  /**
   * 通过ID查找用户 - 支持完整角色信息
   * @param id 用户ID
   * @returns 用户对象或null
   */
  async findById(id: number): Promise<pt.SAFE_USER_TYPE | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        ...pt.SAFE_USER_FIELDS,
      },
    })
 
    return user 
  }
  async findByIdWithRole(id: number): Promise<pt.USER_SAFE_ROLE_DEFAULT_TYPE | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        ...pt.SAFE_USER_FIELDS,
        role: {
          select: pt.DEFAULT_ROLE_FIELDS,
        },
      },
    })
 
    return user 
  }

  /**
   * 通过邮箱查找用户安全字段信息 - 支持默认查询（包含角色默认信息）
   * @param email 邮箱地址
   * @returns 用户对象或null
   */
  async findByEmail(email: string): Promise<pt.USER_SAFE_ROLE_DEFAULT_TYPE | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      select: {
        ...pt.SAFE_USER_FIELDS,
        role: {
          select: pt.DEFAULT_ROLE_FIELDS,
        },
      },
    })
    return user
  }

  /**
   * 通过邮箱查找用户全量信息 - 支持登录查询（包含默认角色信息）
   * @param email 邮箱地址
   * @returns 用户对象或null
   */
  async findByEmailFullForLogin(email: string): Promise<pt.USER_FULL_ROLE_DEFAULT_TYPE | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      select: {
        ...pt.FULL_USER_FIELDS,
        role: {
          select: pt.DEFAULT_ROLE_FIELDS,
        },
      },
    })
    return user
  }

  /**
   * 创建新用户
   * @param userData 用户数据
   * @returns 创建的用户
   */
  async create(userData: Partial<User>): Promise<pt.SAFE_USER_TYPE> {
    const createdUser = await this.prisma.user.create({
      data: {
        email: userData.email as string,
        password: userData.password as string,
        userName: userData.userName as string,
        avatarUrl: userData.avatarUrl as string,
        phone: userData.phone as string,
        roleId: userData.roleId as number,
        deletedAt: userData.deletedAt as Date | null,
      },
      select: {
        ...pt.SAFE_USER_FIELDS,
        role: {
          select: pt.DEFAULT_ROLE_FIELDS,
        },
      },
    })

    return createdUser
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param updateData 更新数据
   * @returns 更新后的用户
   */
  async update(id: number, updateData: UpdateUserDto): Promise<pt.SAFE_USER_TYPE> {
    let updatedUser
    updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: {
          select: pt.DEFAULT_ROLE_FIELDS,
        },
      },
    })

    return updatedUser
  }

  /**
   * 更新用户信息，包含用户名和头像URL
   * @param id 用户ID
   * @param updateData 更新数据,包含avatarUrl和userName
   * @returns 更新后的用户
   */
  async updateProfile(id: number, updateData: {avatarUrl?:string,userName?:string}): Promise<pt.SAFE_USER_TYPE> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: {
          select: pt.DEFAULT_ROLE_FIELDS,
        },
      },
    })

    return updatedUser
  }

  /**
   * 更新刷新令牌
   * @param userId 用户ID
   * @param refreshToken 刷新令牌
   */
  async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    // 首先删除用户现有的刷新令牌
    if (refreshToken === null) {
      // 如果传入null，则删除用户的所有刷新令牌
      await this.prisma.token.deleteMany({
        where: {
          userId,
          type: 'REFRESH',
        },
      })
      return
    }

    // 生成一个合理的过期时间，例如7天后
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // 删除现有刷新令牌并创建新的 - 使用事务
    await this.prisma.transaction(async prisma => {
      // 先删除用户现有的刷新令牌
      await prisma.token.deleteMany({
        where: {
          userId,
          type: 'REFRESH',
        },
      })

      // 创建新的刷新令牌
      await prisma.token.create({
        data: {
          userId,
          token: refreshToken,
          type: 'REFRESH',
          expiresAt,
          deletedAt: null,
        },
      })
    })
  }

  /**
   * 获取用户列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 用户列表和总数
   */
  async findAll(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit

    // 如果filters中包含id字段且为字符串类型，转换为数字
    if (filters.id && typeof filters.id === 'string') {
      filters.id = parseInt(filters.id, 10)
    }

    const [usersData, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          ...filters,
        },
        include: {
          role: {
            select: pt.DEFAULT_ROLE_FIELDS,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: filters }),
    ])

    // 将用户数据数组转换为User实体类实例数组
    const users = usersData.map(userData => userData)

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 删除用户
   * @param id 用户ID
   */
  async delete(id: number): Promise<number> {
    const deletedUser = await this.prisma.user.update({ where: { id }, data: { deletedAt: new Date() } })
    
    return deletedUser.id
  }

  /**
   * 增加用户失败登录尝试次数
   * @param id 用户ID
   * @param amount 增加数量
   */
  async increment(id: number): Promise<pt.SAFE_USER_TYPE> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: { increment: 1 },
      },
      select: pt.SAFE_USER_FIELDS,
    })
  }

  /**
   * 锁定用户
   * @param id 用户ID
   */
  async lockUser(id: number): Promise<pt.SAFE_USER_TYPE> {
    const lockUntil = new Date(Date.now() + this.configService.get('auth.lockoutDuration'))
    return await this.prisma.user.update({
      where: { id },
      data: {lockUntil,},
    })
  }

  /**
   * 重置用户失败登录尝试次数
   * @param id 用户ID
   */
  async resetFailedLoginAttempts(id: number): Promise<boolean> {
    const resetResult = await this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null,
      },
    })
    return resetResult ? true : false
  }
}

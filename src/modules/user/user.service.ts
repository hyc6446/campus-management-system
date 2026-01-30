import { Injectable, HttpStatus } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto'
import type { Prisma, User } from '@prisma/client'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * 通过ID查找用户安全字段信息
   * @param id 用户ID
   * @returns 用户对象
   * @throws NotFoundException 用户不存在
   */
  async findById(id: number): Promise<pt.SAFE_USER_TYPE> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new AppException('用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }

    return user
  }
  async findByIdWithRole(id: number): Promise<pt.USER_SAFE_ROLE_DEFAULT_TYPE | null> {
    return await this.userRepository.findByIdWithRole(id)
  }
  async findByIdOptional(id: number): Promise<pt.SAFE_USER_TYPE | null> {
    return await this.userRepository.findById(id)
  }
  /**
   * 通过邮箱查找用户（可选）- 支持默认查询（包含角色默认信息）
   * @param email 用户邮箱
   * @returns 用户对象或null，包含默认的角色信息
   */
  async findByEmail(email: string): Promise<pt.USER_SAFE_ROLE_DEFAULT_TYPE> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new AppException('用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }

    return user
  }

  async findByEmailOptional(email: string): Promise<pt.USER_SAFE_ROLE_DEFAULT_TYPE | null> {
    return await this.userRepository.findByEmail(email)
  }
  /**
   * 通过邮箱查找用户（可选）- 支持用户完整-角色默认信息（用于登录验证）
   * @param email 用户邮箱
   * @returns 用户对象或null，包含完整的角色信息
   */
  async findByEmailFullForLogin(email: string): Promise<pt.USER_FULL_ROLE_DEFAULT_TYPE | null> {
    return await this.userRepository.findByEmailFullForLogin(email)
  }

  /**
   * 创建新用户
   * @param createData 用户数据
   * @returns 创建的用户
   */
  async create(createData: CreateUserDto): Promise<pt.SAFE_USER_TYPE> {
    return this.userRepository.create(createData)
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param updateData 更新数据
   * @param currentUser 当前登录用户
   * @returns 更新后的用户
   * @throws ForbiddenException 无权限
   * @throws BadRequestException 无效操作
   */
  async update(id: number, updateData: UpdateUserDto): Promise<pt.SAFE_USER_TYPE> {
    const user = await this.findById(id)

    // 检查用户是否存在
    if (!user) {
      throw new AppException('用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    // 权限检查：只能修改自己的资料

    // 检查是否尝试修改角色（非管理员不能修改角色）

    return this.userRepository.update(id, updateData)
  }

  /**
   * 获取分页用户列表
   * @param page 页码
   * @param limit 每页数量
   * @param currentUser 当前用户
   * @param filters 过滤条件
   * @returns 分页结果
   */
  async findAll(query: QueryUserDto) {
    // 非管理员只能看到自己的信息
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createAt',
      order = 'desc',
      id,
      email,
      userName,
      phone,
      roleId,
      createdAt,
    } = query
    const skip = (page - 1) * take
    if (take > 100) {
      throw new AppException('每页数量不能超过100', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST, {
        take,
      })
    }
    const where: Prisma.UserWhereInput = {}
    if (id) where.id = id
    if (email) where.email = { contains: email }
    if (userName) where.userName = { contains: userName }
    if (phone) where.phone = { contains: phone }
    if (roleId) where.roleId = roleId
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.UserOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.userRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number): Promise<boolean> {
    const user = await this.findById(id)
    if (!user) {
      throw new AppException('用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    // 只有管理员或当事人可以删除用户
    if (user.roleId !== 1 || Number(user.id) == id) {
      throw new AppException('无权限停用用户', 'FORBIDDEN', HttpStatus.FORBIDDEN)
    }

    return await this.userRepository.delete(id)
  }

  /**
   * 批量删除用户
   * @param ids 用户ID列表（逗号分隔）
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async deleteMany(ids: string): Promise<boolean> {
    const idNumbers = ids.split(',').map(Number)
    return await this.userRepository.deleteMany(idNumbers)
  }

  /**
   * 激活用户
   * @param id 用户ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async activate(id: number): Promise<boolean> {
    const user = await this.findById(id)
    if (!user) {
      throw new AppException('用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    // 只有管理员可以激活用户
    if (user.roleId !== 1) {
      throw new AppException('无权限激活用户', 'FORBIDDEN', HttpStatus.FORBIDDEN)
    }

    return await this.userRepository.activate(id)
  }

  /**
   * 批量激活用户
   * @param ids 用户ID列表（逗号分隔）
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async activateMany(ids: string): Promise<boolean> {
    const idNumbers = ids.split(',').map(Number)
    return await this.userRepository.activateMany(idNumbers)
  }
  
  /**
   * 获取安全的用户对象（移除敏感字段）
   * @param user 用户对象
   * @returns 安全的用户对象
   */
  // TODO
  getSafeUser(user: pt.USER_FULL_ROLE_DEFAULT_TYPE): Partial<pt.USER_FULL_ROLE_DEFAULT_TYPE> {
    const { password, ...safeUser } = user
    return safeUser
  }

  /**
   * 增加用户失败登录尝试次数
   * @param userId 用户ID
   * @returns 更新后的用户对象
   */
  async incrementFailedLoginAttempts(userId: number): Promise<pt.SAFE_USER_TYPE | null> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new AppException('该用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    // 返回更新后的用户对象
    return await this.userRepository.increment(userId)
  }

  /**
   * 锁定用户账户
   * @param userId 用户ID
   */
  async lockUser(userId: number): Promise<pt.SAFE_USER_TYPE> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new AppException('用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    return await this.userRepository.lockUser(userId)
  }

  /**
   * 重置用户失败登录尝试次数
   * @param userId 用户ID
   */
  async resetFailedLoginAttempts(userId: number): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new AppException('用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    return await this.userRepository.resetFailedLoginAttempts(userId)
  }

  /**
   * 检查用户账户是否被锁定
   * @param userId 用户ID
   * @returns 如果账户被锁定返回true，否则返回false
   */
  async isAccountLocked(userId: number): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new AppException('用户不存在', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    if (user.deletedAt) {
      throw new AppException('用户已被禁用', 'USER_DISABLED', HttpStatus.FORBIDDEN)
    }
    // 如果没有锁定时间，说明没有被锁定
    if (!user.lockUntil) return false
    // 如果锁定时间已过期，自动解锁并返回false
    if (user.lockUntil < new Date()) {
      await this.resetFailedLoginAttempts(userId)
      return false
    }

    return true
  }
}

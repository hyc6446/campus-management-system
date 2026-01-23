import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MinioService } from '@core/minio/minio.service'
import { File } from '@common/types/file.types'
import { UserRepository } from './user.repository'
import { CreateUserDto, UpdateUserDto, UserProfileDto } from './dto/index'
import type { Prisma, User } from '@prisma/client'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private minioService: MinioService,
    private configService: ConfigService
  ) {}

  /**
   * 通过ID查找用户安全字段信息
   * @param id 用户ID
   * @returns 用户对象
   * @throws NotFoundException 用户不存在
   */
  async findById(id: number,): Promise<pt.SAFE_USER_TYPE | null> {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }
  async findByIdWithRole(id: number,): Promise<pt.USER_SAFE_ROLE_DEFAULT_TYPE | null> {
    const user = await this.userRepository.findByIdWithRole(id)

    return user
  }
  async findByIdOptional(id: number,): Promise<pt.SAFE_USER_TYPE | null> {
    const user = await this.userRepository.findById(id)

    return user
  }
  /**
   * 通过邮箱查找用户（可选）- 支持默认查询（包含角色默认信息）
   * @param email 用户邮箱
   * @returns 用户对象或null，包含默认的角色信息
   */
  async findByEmail(email: string): Promise<pt.USER_SAFE_ROLE_DEFAULT_TYPE> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }

  async findByEmailOptional(email: string): Promise<pt.USER_SAFE_ROLE_DEFAULT_TYPE | null> {
    const user = await this.userRepository.findByEmail(email)

    return user
  }
  /**
   * 通过邮箱查找用户（可选）- 支持用户完整-角色默认信息（用于登录验证）
   * @param email 用户邮箱
   * @returns 用户对象或null，包含完整的角色信息
   */
  async findByEmailFullForLogin(email:string): Promise<pt.USER_FULL_ROLE_DEFAULT_TYPE | null>{
    const user = await this.userRepository.findByEmailFullForLogin(email)

    return user
  }

  /**
   * 创建新用户
   * @param createUserDto 用户数据
   * @returns 创建的用户
   */
  async create(createUserDto: CreateUserDto): Promise<pt.SAFE_USER_TYPE> {
    return this.userRepository.create(createUserDto)
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param updateUserDto 更新数据
   * @param currentUser 当前登录用户
   * @returns 更新后的用户
   * @throws ForbiddenException 无权限
   * @throws BadRequestException 无效操作
   */
  async update(id: number, updateUserDto: UpdateUserDto, currentUser: pt.USER_SAFE_ROLE_DEFAULT_TYPE): Promise<pt.SAFE_USER_TYPE> {
    const user = await this.findById(id)
    const updateData ={
      avatarUrl:'',
      userName:updateUserDto.userName,
    }
    // 检查用户是否存在
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    // 权限检查：只能修改自己的资料
    if (currentUser.id !== id) {
      throw new ForbiddenException('无权限进行此操作')
    }
    // 检查是否尝试修改角色（非管理员不能修改角色）
    if(updateUserDto.roleId && currentUser.role.name!=='ADMIN'){
      throw new BadRequestException('无权限修改角色')
    }
    return this.userRepository.update(id, updateUserDto)
  }

  /**
   * 更新个人资料
   * @param id 用户ID
   * @param userProfileDto 个人资料数据
   * @returns 更新后的用户
   */
  async updateProfile(id: number, userProfileDto: UserProfileDto): Promise<pt.SAFE_USER_TYPE> {
    // const user = await this.findById(id)
    const updateData ={
      avatarUrl:'',
      userName:userProfileDto.username,
    }
    // 更新头像（如果有）
    if (userProfileDto.avatar) {
      const avatarUrl = await this.uploadAvatar(userProfileDto.avatar, id.toString())
      updateData.avatarUrl = avatarUrl
    }

    return this.userRepository.update(id, updateData)
  }

  /**
   * 上传用户头像
   * @param file 文件对象
   * @param userId 用户ID
   * @returns 头像URL
   */
  private async uploadAvatar(file: File, userId: string): Promise<string> {
    // 生成唯一文件名

    try {
      // 上传到MinIO
      const fileUrl = await this.minioService.uploadFile(file, `user-avatars/${userId}`, { userId })

      return fileUrl
    } catch (error) {
      throw new BadRequestException('头像上传失败')
    }
  }

  /**
   * 获取分页用户列表
   * @param page 页码
   * @param limit 每页数量
   * @param currentUser 当前用户
   * @param filters 过滤条件
   * @returns 分页结果
   */
  async findAll(page: number, limit: number, currentUser: User, filters: any = {}) {
    // 非管理员只能看到自己的信息
    if (currentUser.roleId !=1) {
      throw new ForbiddenException('无权限查看用户列表')
    }

    return this.userRepository.findAll(page, limit, filters)
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number, currentUser: User): Promise<boolean> {
    const user = await this.findById(id)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    // 只有管理员或当事人可以删除用户
    if (currentUser.roleId !== 1 || Number(user.id) == id) {
      throw new ForbiddenException('无权限停用用户')
    }

    const deletedUserId = await this.userRepository.delete(id)
    return deletedUserId === id
  }

  /**
   * 获取安全的用户对象（移除敏感字段）
   * @param user 用户对象
   * @returns 安全的用户对象
   */
  // TODO
  getSafeUser(user: any): Partial<pt.USER_FULL_ROLE_DEFAULT_TYPE> {
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
      throw new NotFoundException('该用户不存在')
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
      throw new NotFoundException('用户不存在')
    }
    return await this.userRepository.lockUser(userId)
  }

  /**
   * 重置用户失败登录尝试次数
   * @param userId 用户ID
   */
  async resetFailedLoginAttempts(userId: number): Promise<boolean> {
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
      throw new NotFoundException('用户不存在')
    }
    if (user.deletedAt) {
      throw new NotFoundException('用户已被禁用')
    }
    // 如果没有锁定时间，说明没有被锁定
    if (!user.lockUntil) {
      return false
    }

    // 如果锁定时间已过期，自动解锁并返回false
    if (user.lockUntil < new Date()) {
      await this.resetFailedLoginAttempts(userId)
      return false
    }

    return true
  }
}

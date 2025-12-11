import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from '@core/minio/minio.service';
import { File } from '@common/types/file.types';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto, UpdateUserDto, UserProfileDto } from './dto/index';
import type { Prisma, User } from '@prisma/client';
import { DEFAULT_SAFE_USER_SELECT,DEFAULT_USER_SELECT } from '@common/prisma/composite.selects';


@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private minioService: MinioService,
    private configService: ConfigService,
  ) {}

  /**
   * 通过ID查找用户
   * @param id 用户ID
   * @returns 用户对象
   * @throws NotFoundException 用户不存在
   */
  // async findById(id: number): Promise<User> {
  //   const user = await this.userRepository.findById(id);
  //   if (!user) {
  //     throw new NotFoundException('用户不存在');
  //   }
  //   return user;
      
  // }
  async findById(id: number): Promise<User> {
    const queryArgs:Prisma.UserFindUniqueArgs = {
      where:{ id, deletedAt: null },
      ...DEFAULT_USER_SELECT
    }

    const user = await this.userRepository.findById(queryArgs);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    return user;
  }

  /**
   * 通过邮箱查找用户（可选）- 支持灵活查询配置
   * @param email 用户邮箱
   * @param options 查询选项，支持select和include
   * @returns 用户对象或null
   */
  async findByEmailOptional(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    
    return user as User | null;
  }

  /**
   * 通过邮箱查找用户 - 支持灵活查询配置
   * @param email 用户邮箱
   * @param options 查询选项，支持select和include
   * @returns 用户对象
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user as User;
  }
  /**
   * 创建新用户
   * @param createUserDto 用户数据
   * @returns 创建的用户
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
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
  async update(id: number, updateUserDto: UpdateUserDto, currentUser: User): Promise<User> {
    const user = await this.findById(id);
    
    // 权限检查：只能修改自己的资料，管理员可以修改任何用户
    if (currentUser.id !== id && currentUser.roleId !== 1) {
      throw new ForbiddenException('无权限修改此用户');
    }
    
    // 防止普通用户修改自己的角色
    if (currentUser.id === id && currentUser.roleId && updateUserDto.roleId) {
      throw new BadRequestException('普通用户不能修改自己的角色');
    }

    return this.userRepository.update(id, updateUserDto);
  }

  /**
   * 更新个人资料
   * @param id 用户ID
   * @param userProfileDto 个人资料数据
   * @returns 更新后的用户
   */
  async updateProfile(id: number, userProfileDto: UserProfileDto): Promise<any> {
    const user = await this.findById(id);
    
    // 更新头像（如果有）
    if (userProfileDto.avatar) {
      const avatarUrl = await this.uploadAvatar(userProfileDto.avatar, id.toString());
      await this.userRepository.updateAvatar(id, avatarUrl);
    }
    
    // 更新用户名（如果有）
    if (userProfileDto.username) {
      return this.userRepository.update(id, { userName: userProfileDto.username });
    }
    
    return user;
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
      const fileUrl = await this.minioService.uploadFile( file, `user-avatars/${userId}`,{ userId });
      
      return fileUrl;
    } catch (error) {
      throw new BadRequestException('头像上传失败');
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
    if (currentUser.roleId) {
      return {
        data: [currentUser],
        total: 1,
        page: 1,
        limit: 1,
        totalPages: 1,
      };
    }
    
    return this.userRepository.findAll(page, limit, filters);
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number, currentUser: User): Promise<void> {
    // 只有管理员可以删除用户
    if (currentUser.roleId !== 1) {
      throw new ForbiddenException('无权限删除用户');
    }
    
    // 不能删除自己
    if (currentUser.id === id) {
      throw new BadRequestException('不能删除自己的账号');
    }
    
    await this.userRepository.delete(id);
  }

  /**
   * 获取安全的用户对象（移除敏感字段）
   * @param user 用户对象
   * @returns 安全的用户对象
   */
  // TODO
  getSafeUser(user: any): Partial<any> {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  /**
   * 增加用户失败登录尝试次数
   * @param userId 用户ID
   * @returns 更新后的用户对象
   */
  async incrementFailedLoginAttempts(userId: number): Promise<any | null> {
    const queryArgs:Prisma.UserFindUniqueArgs = {
      where:{ id: userId, deletedAt: null },
      ...DEFAULT_USER_SELECT
    }
    
    const user = await this.userRepository.findById(queryArgs);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    await this.userRepository.increment(userId, 'failedLoginAttempts', 1);
    // 返回更新后的用户对象
    return this.userRepository.findById(queryArgs);
  }

  /**
   * 锁定用户账户
   * @param userId 用户ID
   */
  async lockUser(userId: number): Promise<void> {
    const queryArgs:Prisma.UserFindUniqueArgs = {
      where:{ id: userId, deletedAt: null },
      ...DEFAULT_USER_SELECT
    }
    const user = await this.userRepository.findById(queryArgs);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    await this.userRepository.lockUser(userId);
  }

  /**
   * 重置用户失败登录尝试次数
   * @param userId 用户ID
   */
  async resetFailedLoginAttempts(userId: number): Promise<void> {
    await this.userRepository.resetFailedLoginAttempts(userId);
  }

  /**
   * 检查用户账户是否被锁定
   * @param userId 用户ID
   * @returns 如果账户被锁定返回true，否则返回false
   */
  async isAccountLocked(userId: number): Promise<boolean> {
    const queryArgs:Prisma.UserFindUniqueArgs = {
      where:{ id: userId, deletedAt: null },
      ...DEFAULT_USER_SELECT
    }
    const user = await this.userRepository.findById(queryArgs);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    if (user.deletedAt) {
      throw new NotFoundException('用户已被禁用');
    }
    // 如果没有锁定时间，说明没有被锁定
    if (!user.lockUntil) {
      return false;
    }
    
    // 如果锁定时间已过期，自动解锁并返回false
    if (user.lockUntil < new Date()) {
      await this.resetFailedLoginAttempts(userId);
      return false;
    }
    
    return true;
  }
}
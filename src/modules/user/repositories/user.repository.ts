import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@core/prisma/prisma.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/index';
import type { Prisma } from '@prisma/client';
import { DEFAULT_USER_AND_ROLE_FULL } from '@common/prisma/composite.selects';

@Injectable()
export class UserRepository {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * 通过ID查找用户
   * @param id 用户ID
   * @returns 用户对象或null
   */
  async findById(id: number): Promise<User | null> {
    let userData;
    userData = await this.prisma.user.findUnique({
      where: { id },
       include:{
        role:{
          select:{
            id:true,
            name:true,
          }
        }
       }
    });
    // 将Prisma查询结果转换为User实体类实例，以支持虚拟属性name
    return userData ? new User(userData) : null;
  }

  /**
   * 通过邮箱查找用户 - 支持灵活查询配置
   * @param email 用户邮箱
   * @param options 查询选项（Prisma原生格式，支持select）
   * @returns 用户对象或null
   */
  async findByEmail<Args extends Partial<Prisma.UserFindUniqueArgs>>(
    email: string, 
    options: Args = DEFAULT_USER_AND_ROLE_FULL as Args
  ): Promise<Prisma.UserGetPayload<{
    where: { email: string; deletedAt: null };
    select?: Args['select'];
    include?: Args['include'];
  }> | null> {
    console.log("用户仓库层 根据邮箱查找用户 options:", options);
    const userData = await this.prisma.user.findUnique({
      where: { email, deletedAt: null },
      ...options,
    });
    return userData; // 不再需要类型断言！
  }
  /**
   * 创建新用户
   * @param userData 用户数据
   * @returns 创建的用户
   */
  async create(userData: Partial<User>): Promise<User> {
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
      include: { 
        role: {
          select:{
            id:true,
            name:true,
          }
        } 
      },
    });
    // 将创建的用户数据转换为User实体类实例
    // 如果创建成功重新查询用户相关信息并返回
    return new User(createdUser);
  }

  /**
   * 更新用户
   * @param id 用户ID
   * @param updateData 更新数据
   * @returns 更新后的用户
   */
  async update(id: number, updateData: UpdateUserDto): Promise<User> {
    let updatedUser;
      updatedUser = await this.prisma.user.update({
        where: { id },
        data: updateData,
        include: { 
          role: {
            select:{
              id:true,
              name:true,
            }
          } 
        },
      });

    
    // 将更新后的用户数据转换为User实体类实例
    return new User(updatedUser);
  }

  /**
   * 更新用户头像
   * @param id 用户ID
   * @param avatarUrl 头像URL
   * @returns 更新后的用户
   */
  async updateAvatar(id: number, avatarUrl: string): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
      include: { 
        role: {
          select:{
            id:true,
            name:true,
          }
        } 
      },
    });
    // 将更新后的用户数据转换为User实体类实例
    return new User(updatedUser);
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
          type: 'REFRESH'
        }
      });
      return;
    }
    
    // 生成一个合理的过期时间，例如7天后
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    // 删除现有刷新令牌并创建新的 - 使用事务
    await this.prisma.transaction(async (prisma) => {
      // 先删除用户现有的刷新令牌
      await prisma.token.deleteMany({
        where: {
          userId,
          type: 'REFRESH'
        }
      });
      
      // 创建新的刷新令牌
      await prisma.token.create({
        data: {
          userId,
          token: refreshToken,
          type: 'REFRESH',
          expiresAt,
          deletedAt: null
        }
      });
    });
  }

  /**
   * 获取用户列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 用户列表和总数
   */
  async findAll(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    
    // 如果filters中包含id字段且为字符串类型，转换为数字
    if (filters.id && typeof filters.id === 'string') {
      filters.id = parseInt(filters.id, 10);
    }
    
    const [usersData, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          ...filters,
        },
        include: { 
          role: {
            select:{
              id:true,
              name:true,
            }
          } 
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: filters }),
    ]);

    // 将用户数据数组转换为User实体类实例数组
    const users = usersData.map(userData => new User(userData));

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 删除用户
   * @param id 用户ID
   */
  async delete(id: number): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  /**
   * 增加用户失败登录尝试次数
   * @param id 用户ID
   * @param amount 增加数量
   */
  async increment(id: number, field: string, amount: number = 1): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        [field]: { increment: amount },
      },
    });
  }

  /**
   * 锁定用户
   * @param id 用户ID
   */
  async lockUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        lockUntil: new Date(Date.now() + this.configService.get('auth.lockoutDuration')),
      },
    });
  }

  /**
   * 重置用户失败登录尝试次数
   * @param id 用户ID
   */
  async resetFailedLoginAttempts(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null,
      },
    });
  }
}
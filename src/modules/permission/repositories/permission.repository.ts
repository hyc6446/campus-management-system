import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/index';
import { InputJsonValue } from '@prisma/client/runtime/client'

@Injectable()
export class PermissionRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 通过ID查找权限
   * @param id 权限ID
   * @returns 权限对象或null
   */
  async findById(id: number): Promise<Permission | null> {
    const permissionData = await this.prisma.permission.findUnique({
      where: { id }
    });
    
    // 将Prisma查询结果转换为Permission实体类实例，以支持虚拟属性name   
    return permissionData ? new Permission(permissionData) : null;
  }

  /**
   * 通过角色ID查找权限
   * @param roleId 角色ID
   * @returns 权限对象或null
   */
  async findByRoleId(roleId: number): Promise<Permission[] | null> {
    const permissionData = await this.prisma.permission.findMany({
      where: { roleId }
    });
    
    // 将Prisma查询结果转换为Permission实体类实例，以支持虚拟属性name
    return permissionData ? permissionData.map(item => new Permission(item)) : null;
  }


  /**
   * 创建新权限
   * @param permissionData 权限数据
   * @returns 创建的权限
   */
  async create(permissionData: Partial<CreatePermissionDto>): Promise<Permission> {
    const createdPermission = await this.prisma.permission.create({
      data: {
        action: permissionData.action as string,
        subject: permissionData.subject as string,
        conditions: permissionData.conditions as InputJsonValue ,
        roleId: permissionData.roleId as number
      },
    });
    
    // 将创建的权限数据转换为Permission实体类实例
    return new Permission(createdPermission);
  }

  /**
   * 更新权限
   * @param id 权限ID   
   * @param updateData 更新数据
   * @returns 更新后的权限
   */
  async update(id: number, updateData: UpdatePermissionDto): Promise<Permission> {
    const updatedPermission = await this.prisma.permission.update({
      where: { id },
      data: {
        action: updateData.action as string,
        subject: updateData.subject as string,
        conditions: updateData.conditions as InputJsonValue,
        roleId: updateData.roleId as number
      },
    });
    
    // 将更新后的权限数据转换为Permission实体类实例
    return new Permission(updatedPermission);
  }     

  /**
   * 获取权限列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 权限列表和总数
   */
  async findAll(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    
    // 如果filters中包含roleId字段且为字符串类型，转换为数字
    if (filters.roleId && typeof filters.roleId === 'string') {
      filters.roleId = parseInt(filters.roleId, 10);
    }
    
    const [permissionsData, total] = await Promise.all([
      this.prisma.permission.findMany({
        where: {
          ...filters,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.permission.count({ where: filters }),
    ]);

    // 将权限数据数组转换为Permission实体类实例数组
    const permissions = permissionsData.map(permissionData => new Permission(permissionData));

    return {
      data: permissions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 删除权限
   * @param id 权限ID   
   */
  async delete(id: number): Promise<void> {
    await this.prisma.permission.delete({ 
      where: { id },
    });
  }
}
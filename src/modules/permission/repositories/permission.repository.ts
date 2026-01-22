import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/index';
import { Prisma } from '@prisma/client';
import * as all from '@app/common/prisma-types';
import { InputJsonValue } from '@prisma/client/runtime/library';

@Injectable()
export class PermissionRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 通过ID查找权限,
   * 区分为
   * --包含默认字段 findById
   * --包含安全字段 findByIdWithSafe
   * --包含完整字段 findByIdWithFull
   * @param id 权限ID
   * @returns 权限对象或null
   */
  async findById(id: number): Promise<all.DEFAULT_PERMISSION_TYPE | null> {
    const permissionData = await this.prisma.permission.findUnique({
      where: { id },
      select: all.DEFAULT_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }
  async findByIdWithSafe(id: number): Promise<all.SAFE_PERMISSION_TYPE | null> {
    const permissionData = await this.prisma.permission.findUnique({
      where: { id },
      select: all.SAFE_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }
  async findByIdWithFull(id: number): Promise<all.FULL_PERMISSION_TYPE | null> {
    const permissionData = await this.prisma.permission.findUnique({
      where: { id },
      select: all.FULL_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }

  /**
   * 通过action查找权限,
   * 区分为
   * --包含默认字段 findByAction
   * --包含安全字段 findByActionWithSafe
   * --包含完整字段 findByActionWithFull
   * @param action 权限操作类型
   * @returns 权限对象或null
   */
  async findByAction(action: string): Promise<all.DEFAULT_PERMISSION_TYPE[] | null> {
    const permissionData = await this.prisma.permission.findMany({
      where: { action },
      select: all.DEFAULT_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }
  async findByActionWithSafe(action: string): Promise<all.SAFE_PERMISSION_TYPE[] | null> {
    const permissionData = await this.prisma.permission.findMany({
      where: { action },
      select: all.SAFE_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }
  async findByActionWithFull(action: string): Promise<all.FULL_PERMISSION_TYPE[] | null> {
    const permissionData = await this.prisma.permission.findMany({
      where: { action },
      select: all.FULL_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }

  /**
   * 通过RoleId查找权限
   * 区分为
   * --包含默认字段 findByRoleId
   * --包含安全字段 findByRoleIdWithSafe
   * --包含完整字段 findByRoleIdWithFull
   * @param roleId 角色ID
   * @returns 权限对象或null
   */
  async findByRoleId(roleId: number): Promise<all.DEFAULT_PERMISSION_TYPE[] | null> {
    const permissionData = await this.prisma.permission.findMany({
      where: { roleId },
      select: all.DEFAULT_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }
  async findByRoleIdWithSafe(roleId: number): Promise<all.SAFE_PERMISSION_TYPE[] | null> {
    const permissionData = await this.prisma.permission.findMany({
      where: { roleId },
      select: all.SAFE_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }
  async findByRoleIdWithFull(roleId: number): Promise<all.FULL_PERMISSION_TYPE[] | null> {
    const permissionData = await this.prisma.permission.findMany({
      where: { roleId },
      select: all.FULL_PERMISSION_FIELDS,
    });
    
    return permissionData;
  }

  /**
   * 创建新权限
   * @param permissionData 权限数据
   * @returns 创建的权限
   */
  async create(permissionData: CreatePermissionDto): Promise<all.SAFE_PERMISSION_TYPE> {
    const createdPermission = await this.prisma.permission.create({
      data: {
        action: permissionData.action,
        subject: permissionData.subject,
        conditions: permissionData.conditions as InputJsonValue,
        roleId: permissionData.roleId,
        createdAt: permissionData.createdAt
      },
      select: all.SAFE_PERMISSION_FIELDS
    });
    
    // 将创建的权限数据转换为Permission实体类实例
    return createdPermission;
  }

  /**
   * 更新权限
   * @param id 权限ID   
   * @param updateData 更新数据
   * @returns 更新后的权限
   */
  async update(id: number, updateData: UpdatePermissionDto): Promise<all.DEFAULT_PERMISSION_TYPE> {
    const updatedPermission = await this.prisma.permission.update({
      where: { id },
      data: {
        action: updateData.action as string,
        subject: updateData.subject as string,
        conditions: updateData.conditions as InputJsonValue,
        roleId: updateData.roleId as number
      },
      select: all.DEFAULT_PERMISSION_FIELDS
    });
    
    return updatedPermission;
  }     

  /**
   * 获取权限列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 权限列表和总数
   */
  async findAll(page:number, limit:number, skip:number, where: Prisma.PermissionWhereInput, orderBy: Prisma.PermissionOrderByWithRelationInput[]) {
    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.permission.count({ where }),
    ]);

    return { data, total, page, limit }; 
  }

  /**
   * 删除权限
   * @param id 权限ID   
   */
  async delete(id: number): Promise<boolean> {
    // 1.检查操作者是否有删除权限
    // 2.检查要删除的权限是否存在
    const deletedPermission = await this.prisma.permission.delete({  where: { id }, });
    return deletedPermission !== null;
  }
}
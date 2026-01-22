import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@core/prisma/prisma.service';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/index';
import * as all from '@app/common/prisma-types';


@Injectable()
export class RoleRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 通过ID查找角色,
   * 区分为
   * --包含默认字段 findById
   * --包含安全字段 findByIdWithSafe
   * --包含完整字段 findByIdWithFull
   * @param id 角色ID
   * @returns 角色对象或null
   */
  async findById(id: number): Promise<all.DEFAULT_ROLE_TYPE | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      select: all.DEFAULT_ROLE_FIELDS,
    });
    
    return role;
  }

  async findByIdWithSafe(id: number): Promise<all.SAFE_ROLE_TYPE | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      select: all.SAFE_ROLE_FIELDS,
    });
    
    return role;
  }
  async findByIdWithFull(id: number): Promise<all.FULL_ROLE_TYPE | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      select: all.FULL_ROLE_FIELDS,
    });
    
    return role;
  }
  /**
   * 通过名称查找角色
   * 区分为
   * --包含默认字段 findByName
   * --包含安全字段 findByNameWithSafe
   * --包含完整字段 findByNameWithFull
   * @param name 角色名称
   * @returns 角色对象或null
   */
  async findByName(name: string): Promise<all.DEFAULT_ROLE_TYPE | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
      select: all.DEFAULT_ROLE_FIELDS,
    });
    
    return role;
  }
  async findByNameWithSafe(name: string): Promise<all.SAFE_ROLE_TYPE | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
      select: all.SAFE_ROLE_FIELDS,
    });
    
    return role;
  }
  async findByNameWithFull(name: string): Promise<all.FULL_ROLE_TYPE | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
      select: all.FULL_ROLE_FIELDS,
    });
    
    return role;
  }
  /**
   * 创建新角色
   * @param roleData 角色数据
   * @returns 创建的角色
   */
  async create(roleData: CreateRoleDto): Promise<all.SAFE_ROLE_TYPE> {
    const createdRole = await this.prisma.role.create({
      data: roleData,
      select: all.SAFE_ROLE_FIELDS,
    });
    
    return createdRole;
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param updateData 更新数据
   * @returns 更新后的角色
   */
  async update(id: number, updateData: UpdateRoleDto): Promise<all.DEFAULT_ROLE_TYPE> {
    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: updateData,
      select: all.DEFAULT_ROLE_FIELDS,
    });
    
    // 将更新后的角色数据转换为Role实体类实例
    return updatedRole;
  }     

  /**
   * 获取角色列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param sortBy 排序字段, 多个字段用逗号分隔
   * @param order 排序方式, 多个顺序用逗号分隔
   * @returns 角色列表和总数
   */
  async findAll(page:number, limit:number, skip:number, where: Prisma.RoleWhereInput, orderBy: Prisma.RoleOrderByWithRelationInput[]) {
    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.role.count({ where }),
    ]);

    return {
      data,
      page,
      total,
      limit,
    };
  }

  /**
   * 删除角色
   * @param id 角色ID   
   */
  async delete(id: number): Promise<boolean> {
    const deleteRole = await this.prisma.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return deleteRole.deletedAt !== null;
  }
}
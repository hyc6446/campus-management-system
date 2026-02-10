import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from '@app/modules/permission/dto'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class PermissionRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 通过ID查找权限,
   * @param id 权限ID
   * @returns 权限对象或null
   */
  async findById(id: number): Promise<pt.DEFAULT_PERMISSION_TYPE | null> {
    return await this.prisma.permission.findUnique({
      where: { id },
      select: pt.DEFAULT_PERMISSION_FIELDS,
    })
  }
  async findByIdWithSafe(id: number): Promise<pt.SAFE_PERMISSION_TYPE | null> {
    return await this.prisma.permission.findUnique({
      where: { id },
      select: pt.SAFE_PERMISSION_FIELDS,
    })
  }
  async findByIdWithFull(id: number): Promise<pt.FULL_PERMISSION_TYPE | null> {
    return await this.prisma.permission.findUnique({
      where: { id },
      select: pt.FULL_PERMISSION_FIELDS,
    })
  }

  /**
   * 通过action查找权限,
   * @param action 权限操作类型
   * @returns 权限对象或null
   */
  async findByAction(action: string): Promise<pt.DEFAULT_PERMISSION_TYPE[] | null> {
    return await this.prisma.permission.findMany({
      where: { action },
      select: pt.DEFAULT_PERMISSION_FIELDS,
    })
  }
  async findByActionWithSafe(action: string): Promise<pt.SAFE_PERMISSION_TYPE[] | null> {
    return await this.prisma.permission.findMany({
      where: { action },
      select: pt.SAFE_PERMISSION_FIELDS,
    })
  }
  async findByActionWithFull(action: string): Promise<pt.FULL_PERMISSION_TYPE[] | null> {
    return await this.prisma.permission.findMany({
      where: { action },
      select: pt.FULL_PERMISSION_FIELDS,
    })
  }

  /**
   * 通过RoleId查找权限
   * @param roleId 角色ID
   * @returns 权限对象或null
   */
  async findByRoleId(roleId: number): Promise<pt.DEFAULT_PERMISSION_TYPE[] | null> {
    return await this.prisma.permission.findMany({
      where: { roleId },
      select: pt.DEFAULT_PERMISSION_FIELDS,
    })
  }
  // 通过action,subject,roleId查找权限,
  async findByActionSubjectRole(
    action: string,
    subject: string,
    roleId: number
  ): Promise<pt.DEFAULT_PERMISSION_TYPE | null> {
    return await this.prisma.permission.findUnique({
      where: {
        permission_action_subject_role_unique: { action, subject, roleId },
        deletedAt: null,
      },
      select: pt.DEFAULT_PERMISSION_FIELDS,
    })
  }

  /**
   * 创建新权限
   * @param permissionData 权限数据
   * @returns 创建的权限
   */
  async create(data: CreateDto): Promise<pt.SAFE_PERMISSION_TYPE> {
    return await this.prisma.permission.create({
      data,
      select: pt.SAFE_PERMISSION_FIELDS,
    })
  }

  /**
   * 更新权限
   * @param id 权限ID
   * @param updateData 更新数据
   * @returns 更新后的权限
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_PERMISSION_TYPE> {
    return await this.prisma.permission.update({
      where: { id },
      data,
      select: pt.DEFAULT_PERMISSION_FIELDS,
    })
  }

  /**
   * 获取权限列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param orderBy 排序条件
   * @returns 权限列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.PermissionWhereInput,
    orderBy: Prisma.PermissionOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_PERMISSION_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip,
        take,
        orderBy,
        select: pt.DEFAULT_PERMISSION_FIELDS,
      }),
      this.prisma.permission.count({ where }),
    ])

    return { data, total, page, take }
  }

  /**
   * 删除权限
   * @param id 权限ID
   */
  async delete(id: number): Promise<boolean> {
    const deletedPermission = await this.prisma.permission.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return deletedPermission !== null
  }

  /**
   * 恢复权限
   * @param id 权限ID
   */
  async restore(id: number): Promise<boolean> {
    const restoredPermission = await this.prisma.permission.update({
      where: { id },
      data: { deletedAt: null },
    })
    return restoredPermission !== null
  }
}

import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/prisma/prisma.service'
import { CreateDto, UpdateDto } from './dto/index'
import * as pt from '@app/common/prisma-types'

@Injectable()
export class RoleRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 通过ID查找角色,
   * @param id 角色ID
   * @returns 角色对象或null
   */
  async findById(id: number): Promise<pt.DEFAULT_ROLE_TYPE | null> {
    return await this.prisma.role.findUnique({
      where: { id },
      select: pt.DEFAULT_ROLE_FIELDS,
    })
  }

  async findByIdWithSafe(id: number): Promise<pt.SAFE_ROLE_TYPE | null> {
    return await this.prisma.role.findUnique({
      where: { id },
      select: pt.SAFE_ROLE_FIELDS,
    })
  }
  async findByIdWithFull(id: number): Promise<pt.FULL_ROLE_TYPE | null> {
    return await this.prisma.role.findUnique({
      where: { id },
      select: pt.FULL_ROLE_FIELDS,
    })
  }
  /**
   * 通过名称查找角色
   * @param name 角色名称
   * @returns 角色对象或null
   */
  async findByName(name: string): Promise<pt.DEFAULT_ROLE_TYPE | null> {
    return await this.prisma.role.findUnique({
      where: { name },
      select: pt.DEFAULT_ROLE_FIELDS,
    })
  }
  async findByNameWithSafe(name: string): Promise<pt.SAFE_ROLE_TYPE | null> {
    return await this.prisma.role.findUnique({
      where: { name },
      select: pt.SAFE_ROLE_FIELDS,
    })
  }
  async findByNameWithFull(name: string): Promise<pt.FULL_ROLE_TYPE | null> {
    return await this.prisma.role.findUnique({
      where: { name },
      select: pt.FULL_ROLE_FIELDS,
    })
  }
  /**
   * 创建新角色
   * @param roleData 角色数据
   * @returns 创建的角色
   */
  async create(roleData: CreateDto): Promise<pt.SAFE_ROLE_TYPE> {
    return await this.prisma.role.create({
      data: roleData,
      select: pt.SAFE_ROLE_FIELDS,
    })
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param updateData 更新数据
   * @returns 更新后的角色
   */
  async update(id: number, updateData: UpdateDto): Promise<pt.DEFAULT_ROLE_TYPE> {
    return await this.prisma.role.update({
      where: { id },
      data: updateData,
      select: pt.DEFAULT_ROLE_FIELDS,
    })
  }

  /**
   * 获取角色列表（分页）
   * @param page 页码
   * @param take 每页数量
   * @param skip 跳过数量
   * @param where 过滤条件
   * @param sortBy 排序字段, 多个字段用逗号分隔
   * @param order 排序方式, 多个顺序用逗号分隔
   * @returns 角色列表和总数
   */
  async findAll(
    page: number,
    take: number,
    skip: number,
    where: Prisma.RoleWhereInput,
    orderBy: Prisma.RoleOrderByWithRelationInput
  ): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_ROLE_TYPE>> {
    const [data, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip,
        take,
        orderBy,
        select: pt.DEFAULT_ROLE_FIELDS,
      }),
      this.prisma.role.count({ where }),
    ])

    return { data, page, total, take }
  }

  /**
   * 删除角色
   * @param id 角色ID
   */
  async delete(id: number): Promise<boolean> {
    const deleteRole = await this.prisma.role.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
    return deleteRole.deletedAt !== null
  }

  /**
   * 恢复角色
   * @param id 角色ID
   * @returns 恢复成功
   */
  async restore(id: number): Promise<boolean> {
    const restoreRole = await this.prisma.role.update({
      where: { id },
      data: { deletedAt: null },
    })
    return restoreRole.deletedAt === null
  }
}

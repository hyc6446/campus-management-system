import { Injectable, HttpStatus } from '@nestjs/common'
import { PermissionRepository } from '@app/modules/permission/permission.repository'
import { CreatePermissionDto, UpdatePermissionDto, QueryPermissionDto } from '@app/modules/permission/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) { }

  /**
   * 通过ID查找权限
   * 区分为
   * --包含默认字段 findById
   * --包含安全字段 findByIdWithSafe
   * --包含完整字段 findByIdWithFull
   * --包含默认字段 findByIdOptional
   * --包含安全字段 findByIdOptionalWithSafe
   * --包含完整字段 findByIdOptionalWithFull
   * @param id 权限ID
   * @returns 权限对象
   * @throws NotFoundException 权限不存在
   */
  async findById(id: number): Promise<pt.DEFAULT_PERMISSION_TYPE> {
    const permission = await this.permissionRepository.findById(id)
    if (!permission)
      throw new AppException('权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    return permission
  }
  // async findByIdWithSafe(id: number): Promise<pt.SAFE_PERMISSION_TYPE> {}
  // async findByIdWithFull(id: number): Promise<pt.FULL_PERMISSION_TYPE> {}

  async findByIdOptional(id: number): Promise<pt.DEFAULT_PERMISSION_TYPE | null> {
    return await this.permissionRepository.findById(id)
  }
  // async findByIdOptionalWithSafe(id: number): Promise<pt.SAFE_PERMISSION_TYPE | null> {}
  // async findByIdOptionalWithFull(id: number): Promise<pt.FULL_PERMISSION_TYPE | null> {}

  /**
   * 通过roleId查找权限-严格模式
   * 区分为
   * --包含默认字段 findByRoleId
   * --包含安全字段 findByRoleIdWithSafe
   * --包含完整字段 findByRoleIdWithFull
   * @param roleId 角色ID
   * @returns 权限对象
   * @throws NotFoundException 权限不存在
   */
  async findByRoleId(roleId: number): Promise<pt.DEFAULT_PERMISSION_TYPE[]> {
    const permissions = await this.permissionRepository.findByRoleId(roleId)
    if (!permissions)
      throw new AppException('权限列表不存在', 'PERMISSION_LIST_NOT_FOUND', HttpStatus.NOT_FOUND, {
        roleId,
      })
    return permissions
  }
  // async findByRoleIdWithSafe(roleId: number): Promise<pt.SAFE_PERMISSION_TYPE[]> {}
  // async findByRoleIdWithFull(roleId: number): Promise<pt.FULL_PERMISSION_TYPE[]> {}

  async findByRoleIdOptional(roleId: number): Promise<pt.DEFAULT_PERMISSION_TYPE[] | null> {
    return await this.permissionRepository.findByRoleId(roleId)
  }
  // async findByRoleIdOptionalWithSafe(roleId: number): Promise<pt.SAFE_PERMISSION_TYPE[] | null> {}
  // async findByRoleIdOptionalWithFull(roleId: number): Promise<pt.FULL_PERMISSION_TYPE[] | null> {}

  /**
   * 创建新权限
   * @param createPermissionDto 权限数据
   * @returns 创建的权限
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<pt.SAFE_PERMISSION_TYPE> {
    // 1、检查操作用户是否有新增的权限
    // 2、检查action、subject是否已被定义了
    // 3、检查conditions是否符合CASL条件语法
    // 4、检查新增的权限是否已存在
    return this.permissionRepository.create(createPermissionDto)
  }

  /**
   * 更新权限
   * @param id 权限ID
   * @param updatePermissionDto 更新数据
   * @returns 更新后的权限
   * @throws ForbiddenException 无权限
   * @throws BadRequestException 无效操作
   */
  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<pt.DEFAULT_PERMISSION_TYPE> {
    // 1.检查操作者是否存在更新权限
    // 2.检查待更新action,subject是否已被定义了
    // 3.检查conditions是否符合CASL条件语法
    // 4.检查待更新的权限是否已存在相应数据
    // 5.检查id是否存在

    return this.permissionRepository.update(id, updatePermissionDto)
  }

  /**
   * 获取分页权限列表
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 分页结果
   */
  async findAll(query: QueryPermissionDto) {
    // 1.检查操作者是否有查询权限
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', id, action, subject, roleId, createdAt } = query
    const skip = (page - 1) * limit
    if (limit > 100) {
      throw new AppException('每页数量不能超过100', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST, {
        limit,
      })
    }
    const where: Prisma.PermissionWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (action) where.action = action
    if (subject) where.subject = subject
    if (roleId) where.roleId = roleId
    if (createdAt) where.createdAt = { equals: new Date(createdAt) }
    const orderBy: Prisma.PermissionOrderByWithRelationInput = {}
    if (sortBy && order)  orderBy[sortBy as keyof Prisma.PermissionOrderByWithRelationInput] = order as Prisma.SortOrder
    return this.permissionRepository.findAll(page, limit, skip, where, orderBy)
  }

  /**
   * 删除权限
   * @param id 权限ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number): Promise<void> {
    // 1.检查操作者是否有操作权限

    // 2.检查待删除的权限是否存在
    const permission = await this.findById(id)
    // 只有管理员可以删除权限
    if (permission.id !== 1) {
      throw new AppException('无权限删除此权限', 'NO_PERMISSION', HttpStatus.FORBIDDEN, { id })
    }

    await this.permissionRepository.delete(id)
  }
}

import { Injectable, NotFoundException, ForbiddenException, HttpStatus } from '@nestjs/common'
import { PermissionRepository } from './repositories/permission.repository'
import { Permission } from './entities/permission.entity'
import { CreatePermissionDto, UpdatePermissionDto, QueryPermissionDto } from './dto/index'
import * as all from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { Prisma } from '@prisma/client'

@Injectable()
export class PermissionService {
  constructor(private permissionRepository: PermissionRepository) {}

  /**
   * 通过ID查找权限-严格模式
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
  async findById(id: number): Promise<all.DEFAULT_PERMISSION_TYPE> {
    const permission = await this.permissionRepository.findById(id)
    if (!permission)
      throw new AppException('权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    return permission
  }
  async findByIdWithSafe(id: number): Promise<all.SAFE_PERMISSION_TYPE> {
    const permission = await this.permissionRepository.findByIdWithSafe(id)
    if (!permission)
      throw new AppException('权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    return permission
  }
  async findByIdWithFull(id: number): Promise<all.FULL_PERMISSION_TYPE> {
    const permission = await this.permissionRepository.findByIdWithFull(id)
    if (!permission)
      throw new AppException('权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    return permission
  }

  /**
   * 通过ID查找权限-非严格模式
   * 区分为
   * --包含默认字段 findByIdOptional
   * --包含安全字段 findByIdOptionalWithSafe
   * --包含完整字段 findByIdOptionalWithFull
   * @param id 权限ID
   * @returns 权限对象
   */
  async findByIdOptional(id: number): Promise<all.DEFAULT_PERMISSION_TYPE | null> {
    return await this.permissionRepository.findById(id)
  }
  async findByIdOptionalWithSafe(id: number): Promise<all.SAFE_PERMISSION_TYPE | null> {
    return await this.permissionRepository.findByIdWithSafe(id)
  }
  async findByIdOptionalWithFull(id: number): Promise<all.FULL_PERMISSION_TYPE | null> {
    return await this.permissionRepository.findByIdWithFull(id)
  }

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
  async findByRoleId(roleId: number): Promise<all.DEFAULT_PERMISSION_TYPE[]> {
    const permissions = await this.permissionRepository.findByRoleId(roleId)
    if (!permissions)
      throw new AppException('权限列表不存在', 'PERMISSION_LIST_NOT_FOUND', HttpStatus.NOT_FOUND, {
        roleId,
      })
    return permissions
  }
  async findByRoleIdWithSafe(roleId: number): Promise<all.SAFE_PERMISSION_TYPE[]> {
    const permissions = await this.permissionRepository.findByRoleIdWithSafe(roleId)
    if (!permissions)
      throw new AppException('权限列表不存在', 'PERMISSION_LIST_NOT_FOUND', HttpStatus.NOT_FOUND, {
        roleId,
      })
    return permissions
  }
  async findByRoleIdWithFull(roleId: number): Promise<all.FULL_PERMISSION_TYPE[]> {
    const permissions = await this.permissionRepository.findByRoleIdWithFull(roleId)
    if (!permissions)
      throw new AppException('权限列表不存在', 'PERMISSION_LIST_NOT_FOUND', HttpStatus.NOT_FOUND, {
        roleId,
      })
    return permissions
  }

  /**
   * 通过roleId查找权限-非严格模式
   * 区分为
   * --包含默认字段 findByRoleIdOptional
   * --包含安全字段 findByRoleIdWithSafeOptional
   * --包含完整字段 findByRoleIdWithFullOptional
   * @param roleId 角色ID
   * @returns 权限对象
   */
  async findByRoleIdOptional(roleId: number): Promise<all.DEFAULT_PERMISSION_TYPE[] | null> {
    return await this.permissionRepository.findByRoleId(roleId)
  }
  async findByRoleIdOptionalWithSafe(roleId: number): Promise<all.SAFE_PERMISSION_TYPE[] | null> {
    return await this.permissionRepository.findByRoleIdWithSafe(roleId)
  }
  async findByRoleIdOptionalWithFull(roleId: number): Promise<all.FULL_PERMISSION_TYPE[] | null> {
    return await this.permissionRepository.findByRoleIdWithFull(roleId)
  }

  /**
   * 创建新权限
   * @param createPermissionDto 权限数据
   * @returns 创建的权限
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<all.SAFE_PERMISSION_TYPE> {
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
  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<all.DEFAULT_PERMISSION_TYPE> {
    // 1.检查操作者是否存在更新权限
    // 2.检查待更新action,subject是否已被定义了
    // 3.检查conditions是否符合CASL条件语法
    // 4.检查待更新的权限是否已存在相应数据
    // 5.检查id是否存在
    // const permission = await this.findById(id)
    // if (!permission)
    //   throw new AppException('权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    // // 只有管理员可以更新权限
    // if (permission.id !== 1) {
    //   throw new ForbiddenException('无权限修改此权限')
    // }

    return this.permissionRepository.update(id, updatePermissionDto)
  }

  /**
   * 获取分页权限列表
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 分页结果
   */
  async findAll(query: QueryPermissionDto, currentUser: all.USER_SAFE_ROLE_DEFAULT_TYPE) {
    console.log("currentUser===",currentUser)
    // 1.检查操作者是否有查询权限
    // if (currentUser.role.name !== 'ADMIN') {
    //   throw new AppException('无权限查询角色', 'FORBIDDEN_QUERY_ROLE', HttpStatus.FORBIDDEN, {
    //     operator: currentUser.role.name,
    //   })
    // }
    const {page = 1,limit = 10,sortBy = 'createdAt',order = 'desc',id,action,subject,roleId,createdAt} = query
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
    const orderBy: Prisma.PermissionOrderByWithRelationInput[] = []
    if (sortBy && order) {
      const sortKeys = sortBy.split(',')
      const sortOrders = order.split(',')
      sortKeys.forEach((key, index) => {
        const validOrder = sortOrders[index]
        orderBy.push({
          [key as keyof Prisma.RoleOrderByWithRelationInput]: validOrder as Prisma.SortOrder,
        })
      })
    } else {
      orderBy.push({ createdAt: 'desc' })
    }
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
      throw new ForbiddenException('无权限删除此权限')
    }

    await this.permissionRepository.delete(id)
  }
}

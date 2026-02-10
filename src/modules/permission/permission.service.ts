import { Prisma, RoleType } from '@prisma/client'
import { Injectable, HttpStatus } from '@nestjs/common'
import { PermissionRepository } from '@app/modules/permission/permission.repository'
import { CreateDto, UpdateDto, QueryDto } from '@app/modules/permission/dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'
import { RuleConfigService } from '@app/modules/rule-config/rule-config.service'
import { RoleService } from '@app/modules/role/role.service'

@Injectable()
export class PermissionService {
  constructor(
    private permissionRepository: PermissionRepository,
    private ruleConfigService: RuleConfigService,
    private roleService: RoleService
  ) {}

  /**
   * 通过ID查找权限
   * @param id 权限ID
   * @returns 权限对象
   * @throws NotFoundException 权限不存在
   */
  async findById(id: number): Promise<pt.DEFAULT_PERMISSION_TYPE> {
    const permission = await this.permissionRepository.findById(id)
    if (!permission)
      throw new AppException('权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND)
    return permission
  }

  async findByIdOptional(id: number): Promise<pt.DEFAULT_PERMISSION_TYPE | null> {
    return await this.permissionRepository.findById(id)
  }

  /**
   * 通过roleId查找权限-严格模式
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

  async findByRoleIdOptional(roleId: number): Promise<pt.DEFAULT_PERMISSION_TYPE[] | null> {
    return await this.permissionRepository.findByRoleId(roleId)
  }

  /**
   * 创建新权限
   * @param data 权限数据
   * @returns 创建的权限
   */
  async create(data: CreateDto): Promise<pt.SAFE_PERMISSION_TYPE> {
    const { action, subject, roleId } = data

    // 检查action、subject是否已被定义了
    const isAction = await this.ruleConfigService.findByNameAndType(action, 'action')
    if (!isAction) throw new AppException('资源不存在', 'ACTION_NOT_FOUND', HttpStatus.NOT_FOUND)
    const isSubject = await this.ruleConfigService.findByNameAndType(subject, 'subject')
    if (!isSubject) throw new AppException('资源不存在', 'SUBJECT_NOT_FOUND', HttpStatus.NOT_FOUND)
    // 检查新增的权限是否已存在
    const existPermission = await this.permissionRepository.findByActionSubjectRole(
      action,
      subject,
      roleId
    )
    if (existPermission)
      throw new AppException('权限已存在', 'PERMISSION_EXIST', HttpStatus.CONFLICT)
    return this.permissionRepository.create(data)
  }

  /**
   * 更新权限
   * @param id 权限ID
   * @param updatePermissionDto 更新数据
   * @returns 更新后的权限
   * @throws ForbiddenException 无权限
   * @throws BadRequestException 无效操作
   */
  async update(id: number, data: UpdateDto): Promise<pt.DEFAULT_PERMISSION_TYPE> {
    // 检查id是否存在
    const permission = await this.permissionRepository.findById(id)
    if (!permission)
      throw new AppException('该权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    // 检查待更新action,subject是否已被定义了
    const { action, subject, roleId } = data
    const isAction = await this.ruleConfigService.findByNameAndType(action, 'action')
    if (!isAction) throw new AppException('资源不存在', 'ACTION_NOT_FOUND', HttpStatus.NOT_FOUND)
    const isSubject = await this.ruleConfigService.findByNameAndType(subject, 'subject')
    if (!isSubject) throw new AppException('资源不存在', 'SUBJECT_NOT_FOUND', HttpStatus.NOT_FOUND)
    // 检查待更新的权限是否已存在相应数据
    const isExist = await this.permissionRepository.findByActionSubjectRole(action, subject, roleId)
    if (isExist) throw new AppException('该权限已存在', 'PERMISSION_EXIST', HttpStatus.CONFLICT)
    return this.permissionRepository.update(id, data)
  }

  /**
   * 获取分页权限列表
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 分页结果
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_PERMISSION_TYPE>> {
    // 1.检查操作者是否有查询权限
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      action,
      subject,
      roleId,
      createdAt,
    } = query
    const skip = (page - 1) * take
    if (take > 100) {
      throw new AppException('超出最大请求量', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST, {
        take,
      })
    }
    const where: Prisma.PermissionWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (action) where.action = action
    if (subject) where.subject = subject
    if (roleId) where.roleId = roleId
    if (createdAt) where.createdAt = { gte: new Date(createdAt) }
    const orderBy: Prisma.PermissionOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.permissionRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 删除权限
   * @param id 权限ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number): Promise<void> {
    // 检查待删除的权限是否存在
    const isExist = await this.permissionRepository.findByIdWithFull(id)
    if (!isExist) {
      throw new AppException('该权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    // 检查是否是管理员
    const isAdmin = await this.roleService.findById(isExist.roleId)
    if (isAdmin.name !== RoleType.ADMIN) {
      throw new AppException('无操作权限', 'NO_PERMISSION', HttpStatus.FORBIDDEN)
    }
    // 检查权限是否已被删除
    if (isExist.deletedAt) {
      throw new AppException('该权限已停用', 'PERMISSION_DELETED', HttpStatus.CONFLICT)
    }

    await this.permissionRepository.delete(id)
  }

  /**
   * 恢复权限
   * @param id 权限ID
   * @throws ForbiddenException 无权限
   */
  async restore(id: number): Promise<boolean> {
    // 检查待删除的权限是否存在
    const isExist = await this.permissionRepository.findByIdWithFull(id)
    if (!isExist) {
      throw new AppException('该权限不存在', 'PERMISSION_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    // 检查是否是管理员
    const isAdmin = await this.roleService.findById(isExist.roleId)
    if (isAdmin.name !== RoleType.ADMIN) {
      throw new AppException('无操作权限', 'NO_PERMISSION', HttpStatus.FORBIDDEN)
    }
    // 检查权限是否已被删除
    if (!isExist.deletedAt) {
      throw new AppException('该权限已启用', 'PERMISSION_ACTIVE', HttpStatus.CONFLICT)
    }

    return await this.permissionRepository.restore(id)
  }
}

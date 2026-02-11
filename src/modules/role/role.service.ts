import { Prisma } from '@prisma/client'
import { Injectable, HttpStatus } from '@nestjs/common'
import { RoleRepository } from './role.repository'
import { CreateDto, QueryDto, UpdateDto } from './dto'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  /**
   * 通过ID查找角色
   * @description 查找角色时，若角色不存在则抛出异常
   * @param id 角色ID
   * @returns 角色对象
   * @throws NotFoundException 角色不存在
   */
  async findById(id: number): Promise<pt.DEFAULT_ROLE_TYPE> {
    const role = await this.roleRepository.findById(id)
    if (!role) throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND)

    return role
  }

  async findByIdWithFull(id: number): Promise<pt.FULL_ROLE_TYPE> {
    const role = await this.roleRepository.findByIdWithFull(id)
    if (!role) throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND)

    return role
  }

  async findByIdOptional(id: number): Promise<pt.DEFAULT_ROLE_TYPE | null> {
    return await this.roleRepository.findById(id)
  }

  async findByIdWithFullOptional(id: number): Promise<pt.FULL_ROLE_TYPE | null> {
    return await this.roleRepository.findByIdWithFull(id)
  }

  /**
   * 通过名称查找角色（存在时返回角色，不存在时返回null）
   * @description 查找角色时，若角色不存在则抛出异常
   * @param name 角色名称
   * @returns 角色对象或null
   */
  async findByName(name: string): Promise<pt.DEFAULT_ROLE_TYPE> {
    const role = await this.roleRepository.findByName(name)
    if (!role)
      throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND)

    return role
  }

  async findByNameOptional(name: string): Promise<pt.DEFAULT_ROLE_TYPE | null> {
    return await this.roleRepository.findByName(name)
  }

  /**
   * 创建新角色
   * @param createData 角色数据
   * @returns 创建的角色
   */
  async create(createData: CreateDto): Promise<pt.DEFAULT_ROLE_TYPE> {
    // 检查角色名称是否已存在
    const role = await this.roleRepository.findByName(createData.name)
    if (role) {
      throw new AppException('角色名称已存在', 'ROLE_NAME_CONFLICT', HttpStatus.CONFLICT)
    }
    return await this.roleRepository.create(createData)
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param updateData 更新数据
   * @returns 更新后的角色
   * @throws ForbiddenException 无权限
   * @throws BadRequestException 无效操作
   */
  async update(id: number, updateData: UpdateDto): Promise<pt.DEFAULT_ROLE_TYPE> {
    // 权限检查，当前操作人是否为管理员
    // 检查待更新的角色是否存在
    const role = await this.roleRepository.findByIdWithSafe(id)
    if (!role) {
      throw new AppException('该角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    // 检查待更新的角色名称是否已经存在
    const roleNameExist = await this.roleRepository.findByName(updateData.name)
    if (roleNameExist) {
      throw new AppException('角色名称已存在', 'ROLE_NAME_CONFLICT', HttpStatus.CONFLICT)
    }

    return await this.roleRepository.update(id, updateData)
  }

  /**
   * 获取分页角色列表
   * @param query 查询参数
   * @param currentUser 当前操作用户
   * @returns 分页结果
   */
  async findAll(query: QueryDto): Promise<pt.QUERY_LIST_TYPE<pt.DEFAULT_ROLE_TYPE>> {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      name,
    } = query
    console.log('query:', query)
    const skip = (page - 1) * take
    if (take > 100) {
      throw new AppException('每页数量不能超过100', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST)
    }
    const where: Prisma.RoleWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (name) where.name = { contains: name, mode: Prisma.QueryMode.insensitive }
    const orderBy: Prisma.RoleOrderByWithRelationInput =
      sortBy && order ? { [sortBy]: order } : { createdAt: 'desc' }
    return this.roleRepository.findAll(page, take, skip, where, orderBy)
  }

  /**
   * 停用角色
   * @param id 角色ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number): Promise<boolean> {
    // 权限检查，当前操作人是否为管理员
    // 检查待更新的角色是否存在
    const role = await this.roleRepository.findByIdWithFull(id)
    if (!role) {
      throw new AppException('该角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    if (role.deletedAt) {
      throw new AppException('该角色已停用', 'ROLE_ALREADY_DELETED', HttpStatus.BAD_REQUEST)
    }
    return await this.roleRepository.delete(id)
  }

  /**
   * 恢复角色
   * @param id 角色ID
   *
   * @throws ForbiddenException 无权限
   * @throws BadRequestException 角色未停用
   * @throws NotFoundException 角色不存在
   */
  async restore(id: number): Promise<boolean> {
    // 权限检查，当前操作人是否为管理员
    // 检查待更新的角色是否存在
    const role = await this.roleRepository.findByIdWithFull(id)
    if (!role) {
      throw new AppException('该角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND)
    }
    if (!role.deletedAt) {
      throw new AppException('该角色未停用', 'ROLE_NOT_DELETED', HttpStatus.BAD_REQUEST)
    }
    return await this.roleRepository.restore(id)
  }
}

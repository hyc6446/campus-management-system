import { Prisma } from '@prisma/client'
import { Injectable, HttpStatus } from '@nestjs/common'
import { RoleRepository } from './role.repository'
import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from './dto/index'
import * as pt from '@app/common/prisma-types'
import { AppException } from '@app/common/exceptions/app.exception'

@Injectable()
export class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  /**
   * 通过ID查找用户
   * 区分为
   * --默认字段 findById
   * --安全字段 findByIdWithSafe
   * --完整字段 findByIdWithFull
   * --默认字段可选 findByIdOptional
   * --安全字段可选 findByIdWithSafeOptional
   * --完整字段可选 findByIdWithFullOptional
   * @description 查找用户时，若用户不存在则抛出异常
   * @param id 用户ID
   * @returns 用户对象
   * @throws NotFoundException 用户不存在
   */
  async findById(id: number): Promise<pt.DEFAULT_ROLE_TYPE> {
    const role = await this.roleRepository.findById(id)
    if (!role) throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND, { id })

    return role
  }

  // async findByIdWithSafe(id: number): Promise<pt.SAFE_ROLE_TYPE> {
  //   const role = await this.roleRepository.findByIdWithSafe(id);
  //   if (!role) throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND,{id} );

  //   return role;
  // }

  async findByIdWithFull(id: number): Promise<pt.FULL_ROLE_TYPE> {
    const role = await this.roleRepository.findByIdWithFull(id)
    if (!role) throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND, { id })

    return role
  }

  async findByIdOptional(id: number): Promise<pt.DEFAULT_ROLE_TYPE | null> {
    return await this.roleRepository.findById(id)
  }

  // async findByIdWithSafeOptional(id: number): Promise<pt.SAFE_ROLE_TYPE | null> {
  //   return await this.roleRepository.findByIdWithSafe(id);
  // }

  async findByIdWithFullOptional(id: number): Promise<pt.FULL_ROLE_TYPE | null> {
    return await this.roleRepository.findByIdWithFull(id)
  }

  /**
   * 通过名称查找角色（存在时返回角色，不存在时返回null）
   * 区分为
   * --默认字段 findByName
   * --安全字段 findByNameWithSafe
   * --完整字段 findByNameWithFull
   * --默认字段可选 findByNameOptional
   * --安全字段可选 findByNameWithSafeOptional
   * --完整字段可选 findByNameWithFullOptional
   * @description 查找用户时，若用户不存在则抛出异常
   * @param name 角色名称
   * @returns 角色对象或null
   */
  async findByName(name: string): Promise<pt.DEFAULT_ROLE_TYPE> {
    const role = await this.roleRepository.findByName(name)
    if (!role)
      throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND, { name })

    return role
  }

  // async findByNameWithSafe(name: string): Promise<pt.SAFE_ROLE_TYPE> {
  //   const role = await this.roleRepository.findByNameWithSafe(name);
  //   if (!role) throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND,{name} );

  //   return role;
  // }

  // async findByNameWithFull(name: string): Promise<pt.FULL_ROLE_TYPE> {
  //   const role = await this.roleRepository.findByNameWithFull(name);
  //   if (!role) throw new AppException('角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND,{name} );

  //   return role;
  // }

  async findByNameOptional(name: string): Promise<pt.DEFAULT_ROLE_TYPE | null> {
    return await this.roleRepository.findByName(name)
  }

  // async findByNameWithSafeOptional(name: string): Promise<pt.SAFE_ROLE_TYPE | null> {
  //   return await this.roleRepository.findByNameWithSafe(name);
  // }

  // async findByNameWithFullOptional(name: string): Promise<pt.FULL_ROLE_TYPE | null> {
  //   return await this.roleRepository.findByNameWithFull(name);
  // }

  /**
   * 创建新角色
   * @param createData 角色数据
   * @returns 创建的角色
   */
  async create(createData: CreateRoleDto): Promise<pt.SAFE_ROLE_TYPE> {
    // 检查角色名称是否已存在
    const role = await this.roleRepository.findByName(createData.name)
    if (role) {
      throw new AppException('角色名称已存在', 'ROLE_NAME_CONFLICT', HttpStatus.CONFLICT, {
        roleName: role.name,
      })
    }
    return await this.roleRepository.create(createData)
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param updateRoleDto 更新数据
   * @param currentUser 当前登录用户
   * @returns 更新后的角色
   * @throws ForbiddenException 无权限
   * @throws BadRequestException 无效操作
   */
  async update(id: number, updateData: UpdateRoleDto): Promise<pt.DEFAULT_ROLE_TYPE> {
    // 权限检查，当前操作人是否为管理员
    // 检查待更新的角色是否存在
    const role = await this.roleRepository.findByIdWithSafe(id)
    if (!role) {
      throw new AppException('该角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    }
    // 检查待更新的角色名称是否已经存在
    const roleNameExist = await this.roleRepository.findByName(updateData.name)
    if (roleNameExist) {
      throw new AppException('角色名称已存在', 'ROLE_NAME_CONFLICT', HttpStatus.CONFLICT, {
        roleName: roleNameExist.name,
      })
    }

    return await this.roleRepository.update(id, updateData)
  }

  /**
   * 获取分页角色列表
   * @param query 查询参数
   * @param currentUser 当前操作用户
   * @returns 分页结果
   */
  async findAll(query: QueryRoleDto) {
    const {
      page = 1,
      limit: take = 10,
      sortBy = 'createdAt',
      order = 'desc',
      id,
      name,
      createdAt,
    } = query
    const skip = (page - 1) * take
    if (take > 100) {
      throw new AppException('每页数量不能超过100', 'LIMIT_EXCEED', HttpStatus.BAD_REQUEST, {
        take,
      })
    }
    const where: Prisma.RoleWhereInput = { deletedAt: null }
    if (id) where.id = id
    if (name) where.name = { contains: name, mode: Prisma.QueryMode.insensitive }
    if (createdAt) where.createdAt = { equals: new Date(createdAt) }
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
      throw new AppException('该角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    }
    if (role.deletedAt) {
      throw new AppException('该角色已停用', 'ROLE_ALREADY_DELETED', HttpStatus.BAD_REQUEST, { id })
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
      throw new AppException('该角色不存在', 'ROLE_NOT_FOUND', HttpStatus.NOT_FOUND, { id })
    }
    if (!role.deletedAt) {
      throw new AppException('该角色未停用', 'ROLE_NOT_DELETED', HttpStatus.BAD_REQUEST, { id })
    }
    return await this.roleRepository.restore(id)
  }
}

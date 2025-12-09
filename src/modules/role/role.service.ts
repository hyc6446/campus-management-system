import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RoleRepository } from './repositories/role.repository';
import { Role } from './entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dto/index';

@Injectable()
export class RoleService {
  constructor(
    private roleRepository: RoleRepository
  ) {}

  /**
   * 通过ID查找用户
   * @param id 用户ID
   * @returns 用户对象
   * @throws NotFoundException 用户不存在
   */
  async findById(id: number): Promise<Role> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return role;
  }

  /**
   * 通过名称查找角色
   * @param name 角色名称
   * @returns 角色对象
   * @throws NotFoundException 角色不存在
   */
  /**
   * 通过名称查找角色（存在时返回角色，不存在时返回null）
   * @param name 角色名称
   * @returns 角色对象或null
   */
  async findByNameOptional(name: string): Promise<Role | null> {
    return this.roleRepository.findByName(name);
  }

  /**
   * 通过名称查找角色（不存在时抛出异常）
   * @param name 角色名称
   * @returns 角色对象
   * @throws NotFoundException 角色不存在
   */
  async findByName(name: string): Promise<Role> {
    const role = await this.findByNameOptional(name);
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return role;
  }

  /**
   * 创建新角色
   * @param createRoleDto 角色数据
   * @returns 创建的角色
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleRepository.create(createRoleDto);
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
  async update(id: number, updateRoleDto: UpdateRoleDto ): Promise<Role> {
    const role = await this.findById(id);
    
    if (role.id !== 1) {
      throw new ForbiddenException('无权限修改此角色');
    }
    
    return this.roleRepository.update(id, updateRoleDto);
  }

  /**
   * 获取分页角色列表
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 分页结果
   */
  async findAll(page: number, limit: number, filters: any = {}) {
    return this.roleRepository.findAll(page, limit, filters);
  }

  /**
   * 删除角色
   * @param id 角色ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number): Promise<void> {
    const role = await this.findById(id);
    // 只有管理员可以删除角色
    if (role.id !== 1) {
      throw new ForbiddenException('无权限删除角色');
    }
    
    await this.roleRepository.delete(id);
  }

}
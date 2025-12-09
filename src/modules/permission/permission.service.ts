import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PermissionRepository } from './repositories/permission.repository';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/index';

@Injectable()
export class PermissionService {
  constructor(
    private permissionRepository: PermissionRepository
  ) {}

  /**
   * 通过ID查找权限
   * @param id 权限ID
   * @returns 权限对象
   * @throws NotFoundException 权限不存在
   */
  async findById(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {  
      throw new NotFoundException('审计日志不存在');
    }
    return permission;
  }

  /**
   * 通过角色ID查找权限
   * @param roleId 角色ID
   * @returns 权限对象
   * @throws NotFoundException 权限不存在
   */
  async findByRoleId(roleId: number): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findByRoleId(roleId);
    if (!permissions) {
      throw new NotFoundException('权限不存在');
    }
    return permissions;
  }

  /**
   * 创建新权限
   * @param createPermissionDto 权限数据
   * @returns 创建的权限
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionRepository.create(createPermissionDto);
  }

  /**
   * 更新权限
   * @param id 权限ID
   * @param updatePermissionDto 更新数据
   * @param currentUser 当前登录用户
   * @returns 更新后的权限
   * @throws ForbiddenException 无权限
   * @throws BadRequestException 无效操作
   */
  async update(id: number, updatePermissionDto: UpdatePermissionDto ): Promise<Permission> {
    const permission = await this.findById(id);
    // 只有管理员可以更新权限
    if (permission.id !== 1) {
      throw new ForbiddenException('无权限修改此权限');
    }
    
    return this.permissionRepository.update(id, updatePermissionDto);
  }

  /**
   * 获取分页权限列表
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 分页结果
   */
  async findAll(page: number, limit: number, filters: any = {}) {
    return this.permissionRepository.findAll(page, limit, filters);
  }

  /**
   * 删除权限
   * @param id 权限ID
   * @param currentUser 当前用户
   * @throws ForbiddenException 无权限
   */
  async delete(id: number): Promise<void> {
    const permission = await this.findById(id);
    // 只有管理员可以删除权限
    if (permission.id !== 1) {
      throw new ForbiddenException('无权限删除此权限');
    }
    
    await this.permissionRepository.delete(id);
  }

}
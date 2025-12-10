import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';
import { Role } from '../entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from '../dto/index';

@Injectable()
export class RoleRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * 通过ID查找角色
   * @param id 角色ID
   * @returns 角色对象或null
   */
  async findById(id: number): Promise<Role | null> {
    const roleData = await this.prisma.role.findUnique({
      where: { id }
    });
    
    // 将Prisma查询结果转换为Role实体类实例，以支持虚拟属性name
    return roleData ? new Role(roleData) : null;
  }

  /**
   * 通过名称查找角色
   * @param name 角色名称
   * @returns 角色对象或null
   */
  async findByName(name: string): Promise<Role | null> {
    const roleData = await this.prisma.role.findUnique({
      where: { name }
    });
    
    // 将Prisma查询结果转换为Role实体类实例，以支持虚拟属性name
    return roleData ? new Role(roleData) : null;
  }


  /**
   * 创建新角色
   * @param roleData 角色数据
   * @returns 创建的角色
   */
  async create(roleData: Partial<CreateRoleDto>): Promise<Role> {
    const createdRole = await this.prisma.role.create({
      data: {
        name: roleData.name as string
      },
    });
    
    // 将创建的角色数据转换为Role实体类实例
    return new Role(createdRole);
  }

  /**
   * 更新角色
   * @param id 角色ID
   * @param updateData 更新数据
   * @returns 更新后的角色
   */
  async update(id: number, updateData: UpdateRoleDto): Promise<Role> {
    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: {
        name: updateData.name as string
      },
    });
    
    // 将更新后的角色数据转换为Role实体类实例
    return new Role(updatedRole);
  }     

  /**
   * 获取角色列表（分页）
   * @param page 页码
   * @param limit 每页数量
   * @param filters 过滤条件
   * @returns 角色列表和总数
   */
  async findAll(page: number = 1, limit: number = 10, filters: any = {}) {
    const skip = (page - 1) * limit;
    
    // 如果filters中包含id字段且为字符串类型，转换为数字
    if (filters.id && typeof filters.id === 'string') {
      filters.id = parseInt(filters.id, 10);
    }
    
    const [rolesData, total] = await Promise.all([
      this.prisma.role.findMany({
        where: {
          ...filters,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.role.count({ where: filters }),
    ]);

    // 将角色数据数组转换为Role实体类实例数组
    const roles = rolesData.map(roleData => new Role(roleData));

    return {
      data: roles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 删除角色
   * @param id 角色ID   
   */
  async delete(id: number): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }
}
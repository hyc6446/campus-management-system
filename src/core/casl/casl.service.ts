import { HttpStatus, Injectable } from '@nestjs/common'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { AbilityFactory } from './ability.factory'
import { Action, Subjects, AppAbility } from './casl.types'
import { User } from '@app/modules/user/user.entity'
import * as pt from '@app/common/prisma-types'
import { PermissionService } from '@app/modules/permission/permission.service'
import { RedisService } from '@app/core/redis/redis.service'
import { ABILITY_CACHE_KEY, ABILITY_CACHE_TTL } from '@app/common/constants/permission.constants'
import { AppException } from '@app/common/exceptions/app.exception'

@Injectable()
export class CaslService {
  constructor(
    private abilityFactory: AbilityFactory,
    private permissionService: PermissionService,
    private redisService: RedisService
  ) {}

  /**
   * 根据角色ID获取权限规则
   * 用于获取指定角色下的所有权限规则，通常在CASL工厂类中使用
   *
   * @param roleId 角色ID，用于查询该角色下的所有权限
   * @returns 包含该角色所有权限规则的数组
   */
  async getPermissionByRoleId(roleId: number): Promise<pt.DEFAULT_PERMISSION_TYPE[]> {
    try {
      if (!roleId) return []
      const permissions = await this.permissionService.findByRoleId(roleId)
      if (!permissions || permissions.length === 0) return []
      return permissions
    } catch (error) {
      return []
    }
  }

  /**
   * 获取空权限能力对象
   * 生成一个没有任何权限规则的能力对象，适用于匿名用户或未经身份验证的场景
   *
   * @returns 无任何权限的能力对象
   */
  async getNullAbility(): Promise<AppAbility> {
    return this.abilityFactory.createForNull()
  }

  /**
   * 为指定角色定义权限能力
   * 根据角色ID生成相应的权限规则集合
   *
   * @param roleId 角色ID，用于查询权限规则
   * @returns 配置好的能力对象，包含该角色的所有权限规则
   */
  async defineAbility(roleId: number): Promise<AppAbility> {
    // 创建能力构建器，用于定义权限规则
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

    try {
      const permissions = await this.getPermissionByRoleId(roleId)

      // 如果没有权限规则，返回空能力对象
      if (!permissions || permissions.length === 0) return this.getNullAbility()

      // 构建权限规则
      permissions.forEach(permission => {
        can(permission.action as Action, permission.subject as Subjects)
      })

      return build()
    } catch (error) {
      return this.getNullAbility()
    }
  }
  /**
   * 为指定用户创建能力对象
   * 根据用户角色和属性生成相应的权限规则集合
   *
   * @param user 用户对象，如果为null或undefined则返回无权限的能力对象
   * @returns 包含用户所有权限规则的能力对象
   * @example
   * const user = { id: 1, role: 'TEACHER', classIds: [1, 2] };
   * const ability = await caslService.getAbility(user);
   * // ability对象现在包含了教师角色的所有权限规则
   */
  async getAbility(user: User | null | undefined): Promise<AppAbility> {
    try {
      if (!user) return await this.getNullAbility()

      // 尝试从缓存获取权限数据
      const cacheKey = ABILITY_CACHE_KEY(user.id, user.roleId)
      const cachedPermissions = await this.redisService.get(cacheKey)
      
      if (cachedPermissions) {
        // 从缓存的权限数据重新构建能力对象
        return this.buildAbilityFromPermissions(cachedPermissions)
      }

      // 根据用户角色和属性生成相应的权限规则
      const permissions = await this.getPermissionByRoleId(user.roleId)
      const ability = await this.defineAbility(user.roleId)
      
      // 缓存权限数据，而不是完整的能力对象
      await this.redisService.set(cacheKey, permissions, ABILITY_CACHE_TTL)

      return ability
    } catch (cacheError) {
      // 缓存错误不影响主流程，继续构建能力对象
      return await this.getNullAbility()
    }
  }

  /**
   * 从权限数据构建能力对象
   * @param permissions 权限数据数组
   * @returns 构建好的能力对象
   */
  private buildAbilityFromPermissions(permissions: pt.DEFAULT_PERMISSION_TYPE[]): AppAbility {
    
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility)
    
    if (permissions && permissions.length > 0) {
      permissions.forEach(permission => {
        if (typeof permission.action === 'string' && typeof permission.subject === 'string') {
          can(permission.action as Action, permission.subject as Subjects)
        }
      })
    }
    
    return build()
  }

  /**
   * 检查用户是否具有指定权限【动态权限检查机制】
   * 用于快速验证用户是否可以对特定资源执行特定操作
   *
   * @param user 用户对象
   * @param action 操作类型（如读取、创建、更新、删除等）
   * @param subject 资源类型（如用户、课程、成绩等）
   * @param conditions 特定条件（可选），用于检查对资源特定条件的权限
   * @returns 是否具有执行指定操作的权限
   * @example
   * // 检查用户是否可以读取课程
   * const canReadCourse = await caslService.can(user, Action.Read, 'Course');
   * 
   * // 检查用户是否可以更新用户资料的特定字段
   * const canUpdateProfileName = await caslService.can(user, Action.Update, 'Profile', 'name');
   */
  async can(
    user: User | null | undefined,
    action: Action,
    subject: Subjects,
    conditions?: any
  ): Promise<boolean> {
    try {
      const ability = await this.getAbility(user)
      return ability.can(action, subject, conditions)
    } catch (error) {
      return false
    }
  }
  /**
   * 清除指定用户的能力缓存
   * 当用户的权限规则发生变化时，调用此方法清除其缓存，确保后续权限检查使用最新规则
   *
   * @param userId 用户ID，用于指定要清除缓存的用户
   * @param toleId 角色ID，用于指定用户的角色
   */
  async cleanAbilityCache(userId:number, toleId:number) {
    try {
      const cacheKey = ABILITY_CACHE_KEY(userId, toleId)
      await this.redisService.delete(cacheKey)
    } catch (error) {
      // 缓存错误不影响主流程，继续执行
      throw new AppException(`清除用户${userId}的能力缓存失败`, 'CACHE_ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  // async cleanAllCache() {
  //   try {
  //     await this.redisService.flush()
  //   } catch (error) {
  //     console.error('Error cleaning ability cache:', error)
  //   }
  // }

}

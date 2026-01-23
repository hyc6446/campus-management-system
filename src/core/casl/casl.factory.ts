/**
 * CASL 工厂模块
 * 负责为不同角色的用户创建具体的权限规则集合
 *
 * 主要功能：
 * - 为不同角色（管理员、教师、学生、家长）生成对应的权限规则
 */
import { Injectable } from '@nestjs/common'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'
import { User } from '@modules/user/user.entity'
import { Action, Subjects, AppAbility } from './casl.types';
import { PermissionService } from '@modules/permission/permission.service'
/**
 * CASL工厂类
 * 根据用户角色生成相应的权限规则集合
 */
@Injectable()
export class CaslFactory {
  constructor(private permissionService: PermissionService) {}
  /**
   * 为指定用户定义权限能力
   * 根据用户的角色和属性生成相应的权限规则集合
   *
   * @param user 用户对象，包含角色信息和其他属性
   * @returns 配置好的能力对象，包含用户的所有权限规则
   * @example
   * const adminUser = { role: 'ADMIN' };
   * const ability = caslFactory.defineAbility(adminUser);
   * // ability对象现在包含了管理员的所有权限规则
   */

  async defineAbility(user: User): Promise<AppAbility> {
    // 创建能力构建器，用于定义权限规则
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)
    // 从数据库加载角色对应的权限规则
    const permissions = await this.permissionService.findByRoleId(user.roleId);
    // 遍历权限规则，添加到能力构建器
    permissions.forEach(permission => {
      can(permission.action as Action, permission.subject as Subjects, permission.conditions as any || {})
    })
    return build()
  }
}

/**
 * @description CaslFactory 使用说明
 *
 * // 1. 直接使用CaslFactory创建能力对象
 * import { CaslFactory } from '@core/casl/casl.factory';
 *
 * @Injectable()
 * export class SomeService {
 *   constructor(private caslFactory: CaslFactory) {}
 *
 *   async performAction(user: User, action: string, resource: any) {
 *     // 获取用户的权限能力对象
 *     const ability = this.caslFactory.defineAbility(user);
 *
 *     // 检查权限
 *     if (ability.can(action, resource)) {
 *       // 执行操作
 *     } else {
 *       throw new ForbiddenException('权限不足');
 *     }
 *   }
 * }
 *
 * // 2. 角色权限矩阵说明
 * // 管理员(ADMIN):
 * // - 可管理所有资源
 * //
 * // 教师(TEACHER):
 * // - 可管理自己的个人资料
 * // - 可管理自己教授的课程
 * // - 可管理自己教授课程的学生成绩
 * // - 可查看自己所教班级的学生信息
 * //
 * // 学生(STUDENT):
 * // - 可管理自己的个人资料
 * // - 可查看自己的成绩
 * // - 可查看所在班级的课程信息
 * //
 * // 家长(PARENT):
 * // - 可查看关联学生的个人资料
 * // - 可查看关联学生的成绩
 * // - 可查看关联学生的考勤记录
 */

import { Injectable } from '@nestjs/common';
import { CaslFactory } from './casl.factory';
import { AbilityFactory } from './ability.factory';
import { Action, Subjects, AppAbility } from './casl.types';
import { User } from '@modules/user/entities/user.entity';

/**
 * CASL 权限服务类
 * 负责管理和检查用户权限，是系统权限控制的核心服务
 */
@Injectable()
export class CaslService {
  constructor(
    private caslFactory: CaslFactory,
    private abilityFactory: AbilityFactory,
  ) {}

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
    // 如果用户不存在，返回空权限对象（无任何权限）
    if (!user) {
      return this.abilityFactory.createForNull();
    }
    
    // 根据用户角色和属性生成相应的权限规则
    return this.caslFactory.defineAbility(user);
  }

  /**
   * 检查用户是否具有指定权限【动态权限检查机制】
   * 用于快速验证用户是否可以对特定资源执行特定操作
   * 
   * @param user 用户对象
   * @param action 操作类型（如读取、创建、更新、删除等）
   * @param subject 资源类型（如用户、课程、成绩等）
   * @param field 特定字段（可选），用于检查对资源特定字段的权限
   * @returns 是否具有执行指定操作的权限
   * @example
   * // 检查用户是否可以读取课程
   * const canReadCourse = await caslService.can(user, Action.Read, 'Course');
   * 
   * // 检查用户是否可以更新用户资料的特定字段
   * const canUpdateProfileName = await caslService.can(user, Action.Update, 'Profile', 'name');
   */
  async can(user: User | null | undefined, action: Action, subject: Subjects, field?: string): Promise<boolean> {
    // 获取用户的能力对象
    const ability = await this.getAbility(user);
    // 使用CASL的can方法检查权限
    return ability.can(action, subject, field);
  }
}

import { Injectable } from '@nestjs/common';
import { AbilityBuilder, MongoQuery, ExtractSubjectType, SubjectRawRule, createMongoAbility } from '@casl/ability';
import { Action, Subjects, AppAbility } from './casl.types';



/**
 * 能力工厂类
 * 用于创建具有特定权限规则的 CASL 能力对象
 * 可根据用户角色或自定义规则生成不同的权限配置
 */
/**
 * 能力工厂类
 * 提供创建和管理能力对象的工具方法
 */
@Injectable()
export class AbilityFactory {
  /**
   * 创建空权限能力对象
   * 生成一个没有任何权限规则的能力对象，适用于匿名用户或未经身份验证的场景
   * 
   * @returns 无任何权限的能力对象
   * @example
   * const ability = abilityFactory.createForNull();
   * // ability.can('read', 'Article') 会返回 false
   */
  createForNull(): AppAbility {
    // 创建一个空的能力构建器，不添加任何权限规则
    const { build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    // 构建能力对象，使用默认的主题类型检测
    return build();
  }

  /**
   * 创建自定义权限能力对象
   * 根据传入的规则数组创建自定义的能力对象，适用于特殊场景或测试环境
   * 
   * @param rules 权限规则数组，每条规则包含[操作, 资源, 条件]三部分
   * @returns 具有自定义权限规则的能力对象
   * @example
   * const rules = [
   *   [Action.Read, 'Article', { published: true }],
   *   [Action.Update, 'Article', { authorId: currentUser.id }]
   * ];
   * const ability = abilityFactory.createForCustom(rules);
   */
createForCustom(rules: Array<SubjectRawRule<Action, ExtractSubjectType<Subjects>, MongoQuery>>): AppAbility {
    // 使用createMongoAbility工厂函数创建能力对象，传入自定义规则
    // 这是CASL 6.7.3版本推荐的方式，替代了已弃用的Ability构造函数
    return createMongoAbility<[Action, Subjects]>(rules);
  }
}

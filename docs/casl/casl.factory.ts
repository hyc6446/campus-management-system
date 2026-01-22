// // src/core/casl/casl.factory.ts
// import { Injectable } from '@nestjs/common';
// import { AbilityBuilder, createMongoAbility } from '@casl/ability';
// import { User } from '@modules/user/entities/user.entity';
// import { Action, Subjects, AppAbility } from './casl.types';
// import { Role, permissionRules } from './permission.rules';

// @Injectable()
export class CaslFactory {
//   async defineAbility(user: any): Promise<AppAbility> {
//     const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
    
//     // 获取用户角色对应的权限规则
//     const userRole = this.getUserRole(user.roleId);
//     const userRules = permissionRules.filter(rule => rule.role === userRole);
    
//     // 解析用户上下文数据（用于动态条件）
//     const userContext = await this.getUserContext(user);
    
//     // 应用权限规则
//     userRules.forEach(rule => {
//       if (rule.inverted) {
//         cannot(rule.action, rule.subject, this.parseConditions(rule.conditions, userContext));
//       } else {
//         can(rule.action, rule.subject, this.parseConditions(rule.conditions, userContext));
//       }
//     });
    
//     return build();
//   }

//   // 根据 roleId 获取角色枚举
//   private getUserRole(roleId: number): Role {
//     // 这里根据实际的角色ID映射关系返回对应的角色
//     const roleMap: Record<number, Role> = {
//       1: Role.ADMIN,
//       2: Role.TEACHER,
//       3: Role.STUDENT,
//       4: Role.PARENT
//     };
//     return roleMap[roleId] || Role.STUDENT;
//   }

//   // 获取用户上下文数据（用于解析动态条件）
  private async getUserContext(user: any): Promise<any> {
    // 这里可以从数据库加载用户相关的上下文数据
    return {
      currentUserId: user.id,
      currentRoleId: user.roleId,
      // 教师相关数据（示例）
      teacherClassIds: [1, 2, 3], // 假设教师教授的班级ID列表
      teacherCourseIds: [4, 5, 6], // 假设教师教授的课程ID列表
      // 学生相关数据（示例）
      studentClassId: 1, // 假设学生所在班级ID
      // 家长相关数据（示例）
      childUserIds: [7, 8], // 假设家长关联的学生ID列表
      childClassIds: [1, 2] // 假设家长关联学生所在班级ID列表
    };
  }

//   // 解析动态条件（替换占位符）
  private parseConditions(conditions: any, context: any): any {
    if (!conditions) return conditions;
    
    const parsed = { ...conditions };
    
    Object.keys(parsed).forEach(key => {
      const value = parsed[key];
      
      // 替换动态占位符
      if (typeof value === 'string') {
        if (value === '$currentUserId') parsed[key] = context.currentUserId;
        if (value === '$currentRoleId') parsed[key] = context.currentRoleId;
      }
      // 处理数组中的占位符
      else if (Array.isArray(value)) {
        parsed[key] = value.map(item => 
          typeof item === 'string' && item.startsWith('$') ? context[item.substring(1)] : item
        );
      }
      // 处理嵌套对象
      else if (typeof value === 'object' && value !== null) {
        parsed[key] = this.parseConditions(value, context);
      }
    });
    
    return parsed;
  }
}
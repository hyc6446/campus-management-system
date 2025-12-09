import { Module, Global, forwardRef } from '@nestjs/common';
import { CaslService } from './casl.service';
import { CaslFactory } from './casl.factory';
import { AbilityFactory } from './ability.factory';
import { PermissionModule } from '@modules/permission/permission.module';

/**
 * CASL权限模块
 * 标记为全局模块，确保权限服务可以在整个应用中访问
 */
@Global()
@Module({
  imports: [
    forwardRef(() => PermissionModule), // 导入权限模块，获取权限信息
  ],
  // 注册权限相关的服务提供者
  providers: [
    CaslService,     // 权限服务，提供权限检查功能
    CaslFactory,     // CASL工厂，用于创建基于用户角色的权限规则
    AbilityFactory,  // 能力工厂，用于创建空权限或自定义权限
  ],
  // 导出供其他模块使用的服务
  exports: [
    CaslService,     // 导出主要的权限服务
    AbilityFactory,  // 导出能力工厂，允许创建自定义权限
  ],
})
export class CaslModule {}

/**
 * @description CaslModule 使用说明
 * 
 * // 1. 在应用主模块中导入（可选，因为已标记为Global）
 * import { Module } from '@nestjs/common';
 * import { CaslModule } from '@core/casl/casl.module';
 * 
 * @Module({
 *   imports: [
 *     // 虽然标记为全局模块，但为了明确依赖关系，仍可在此导入
 *     CaslModule,
 *   ],
 * })
 * export class AppModule {}
 * 
 * // 2. 在其他模块中直接注入使用（无需额外导入CaslModule）
 * import { Module } from '@nestjs/common';
 * import { CourseController } from './course.controller';
 * import { CourseService } from './course.service';
 * 
 * @Module({
 *   controllers: [CourseController],
 *   providers: [CourseService],
 * })
 * export class CourseModule {}
 * 
 * // 3. 在服务中使用CaslService
 * import { Injectable } from '@nestjs/common';
 * import { CaslService } from '@core/casl/casl.service';
 * import { Action } from '@core/casl/ability.factory';
 * 
 * @Injectable()
 * export class CourseService {
 *   constructor(private caslService: CaslService) {}
 * 
 *   async getCourses(user: any) {
 *     // 检查权限
 *     const canView = await this.caslService.can(user, Action.Read, 'Course');
 *     
 *     if (!canView) {
 *       throw new ForbiddenException('无权限查看课程');
 *     }
 *     
 *     // 业务逻辑...
 *   }
 * }
 */
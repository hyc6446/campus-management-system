/**
 * CASL 权限守卫
 * 用于拦截请求并检查用户是否具有执行特定操作的权限
 * 
 * 主要功能：
 * - 从装饰器中提取权限要求
 * - 获取当前用户的权限能力对象
 * - 验证用户是否具有所有要求的权限
 * - 无权限时抛出 ForbiddenException
 */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslService } from './casl.service';
import { CHECK_PERMISSIONS_KEY } from '@common/decorators/permissions.decorator';
import { Action, Subjects, AppAbility } from './casl.types';

/**
 * 权限要求接口
 * 定义了访问特定资源所需的操作类型和资源类型
 */
interface RequiredPermission {
  /** 操作类型，如读取、创建、更新、删除等 */
  action: Action;
  /** 资源类型，如用户、课程、成绩等 */
  subject: Subjects;
}

/**
 * CASL权限守卫类
 * 实现NestJS的CanActivate接口，用于路由权限控制
 */
@Injectable()
export class CaslGuard implements CanActivate {
  /**
   * 构造函数
   * @param reflector NestJS的Reflector服务，用于从元数据中提取权限信息
   * @param caslService CASL权限服务，用于获取和检查用户权限
   */
  constructor(
    private reflector: Reflector,
    private caslService: CaslService,
  ) {}

  /**
   * 检查请求是否可以被激活（是否有权限访问）
   * @param context 执行上下文，包含请求信息和路由处理函数
   * @returns 布尔值，表示是否允许请求通过
   * @throws ForbiddenException 当用户缺少必要权限时抛出
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 从路由处理函数的元数据中提取权限要求
    const permissions = this.reflector.get<RequiredPermission[]>(
      CHECK_PERMISSIONS_KEY,
      context.getHandler(),
    );

    // 如果没有定义权限要求，直接放行
    if (!permissions || permissions.length === 0) {
      return true;
    }

    // 获取HTTP请求对象和当前用户（由认证守卫设置）
    const request = context.switchToHttp().getRequest();
    const user = request.user; // 由AuthGuard设置
    
    // 获取用户的能力对象，包含该用户的所有权限规则
    const ability = await this.caslService.getAbility(user);
    
    // 检查所有要求的权限，确保用户具有所有必要的权限
    for (const permission of permissions) {
      const { action, subject } = permission;
      
      // 如果用户缺少任一权限，抛出禁止访问异常
      if (!ability.can(action, subject)) {
        throw new ForbiddenException(
          `没有足够的权限执行操作: ${action} on ${subject}`,
        );
      }
    }

    // 用户具有所有必要权限，允许请求通过
    return true;
  }
}

/**
 * @description CaslGuard 使用案例
 * 
 * // 1. 定义权限装饰器示例（假设存在）
 * import { SetMetadata } from '@nestjs/common';
 * import { Action } from '@core/casl/ability.factory';
 * import { Subjects } from '@core/casl/casl.factory';
 * 
 * export const CHECK_PERMISSIONS_KEY = 'check_permissions';
 * 
 * export const CheckPermissions = (...permissions: { action: Action, subject: Subjects }[]) =>
 *   SetMetadata(CHECK_PERMISSIONS_KEY, permissions);
 * 
 * // 2. 在控制器中使用CaslGuard
 * import { Controller, Get, UseGuards } from '@nestjs/common';
 * import { JwtAuthGuard } from '@core/auth/guards/jwt-auth.guard';
 * import { CaslGuard } from '@core/casl/casl.guard';
 * import { CheckPermissions } from '@common/decorators/permissions.decorator';
 * import { Action } from '@core/casl/ability.factory';
 * 
 * @Controller('courses')
 * export class CourseController {
 *   // 使用JWT认证守卫和CASL权限守卫
 *   @UseGuards(JwtAuthGuard, CaslGuard)
 *   // 要求用户具有读取课程的权限
 *   @CheckPermissions({ action: Action.Read, subject: 'Course' })
 *   @Get()
 *   async getAllCourses() {
 *     // 只有具有相应权限的用户才能访问此方法
 *     return [{ id: 1, name: '数学' }, { id: 2, name: '语文' }];
 *   }
 * 
 *   // 复合权限要求示例
 *   @UseGuards(JwtAuthGuard, CaslGuard)
 *   @CheckPermissions(
 *     { action: Action.Update, subject: 'Course' },
 *     { action: Action.Read, subject: 'User' }
 *   )
 *   @Put(':id')
 *   async updateCourse(@Param('id') id: number, @Body() data: any) {
 *     // 用户需要同时具有更新课程和读取用户的权限
 *     return { id, ...data };
 *   }
 * }
 * 
 * // 3. 在全局或模块级别应用守卫
 * import { Module } from '@nestjs/common';
 * import { APP_GUARD } from '@nestjs/core';
 * import { JwtAuthGuard } from '@core/auth/guards/jwt-auth.guard';
 * import { CaslGuard } from '@core/casl/casl.guard';
 * 
 * @Module({
 *   providers: [
 *     // 全局应用认证守卫
 *     { provide: APP_GUARD, useClass: JwtAuthGuard },
 *     // 全局应用权限守卫
 *     { provide: APP_GUARD, useClass: CaslGuard },
 *   ],
 * })
 * export class AppModule {}
 * 
 * // 4. 结合角色和权限的细粒度控制
 * @UseGuards(JwtAuthGuard, CaslGuard)
 * @CheckPermissions({ action: Action.Manage, subject: 'Course' })
 * @Post('courses')
 * async createCourse(@Body() courseData: any) {
 *   // 只有具有管理课程权限的用户（如管理员或教师）可以创建课程
 *   return this.courseService.create(courseData);
 * }
 */
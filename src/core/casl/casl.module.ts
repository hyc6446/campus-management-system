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

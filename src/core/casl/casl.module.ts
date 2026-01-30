import { Module, Global, forwardRef } from '@nestjs/common'
import { CaslService } from './casl.service'
// import { CaslFactory } from './casl.factory'
import { AbilityFactory } from './ability.factory'
import { RedisModule } from '@app/core/redis/redis.module'
import { PermissionModule } from '@app/modules/permission/permission.module'

/**
 * CASL权限模块
 * 标记为全局模块，确保权限服务可以在整个应用中访问
 */
@Global()
@Module({
  imports: [
    forwardRef(() => PermissionModule), // 导入权限模块，获取权限信息
    RedisModule, // 导入Redis模块，用于缓存权限规则
  ],
  // 注册权限相关的服务提供者
  providers: [CaslService, AbilityFactory],
  // 导出供其他模块使用的服务
  exports: [CaslService, AbilityFactory],
})
export class CaslModule {}

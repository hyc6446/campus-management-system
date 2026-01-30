import { Module } from '@nestjs/common'
import { AuthController } from '@app/modules/auth/auth.controller'
import { AuthService } from '@app/modules/auth/auth.service'
import { AuthCoreModule } from '@app/core/auth/auth.module'
import { UserModule } from '@app/modules/user/user.module'
import { RoleModule } from '@app/modules/role/role.module'
import { CaslModule } from '@app/core/casl/casl.module'
import { RedisModule } from '@app/core/redis/redis.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [AuthCoreModule, CaslModule, UserModule, RoleModule, RedisModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthController } from '@app/modules/auth/auth.controller';
import { AuthService } from '@app/modules/auth/auth.service';
import { AuthCoreModule } from '@app/core/auth/auth.module';
import { UserModule } from '@app/modules/user/user.module';
import { RoleModule } from '@app/modules/role/role.module';
import { CaslModule } from '@app/core/casl/casl.module';

@Module({
  imports: [
    AuthCoreModule,   // 依赖核心认证模块
    CaslModule,       // 依赖CASL权限模块
    UserModule,       // 依赖用户模块
    RoleModule,       // 依赖角色模块
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
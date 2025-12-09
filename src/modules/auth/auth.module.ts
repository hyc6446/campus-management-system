import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCoreModule } from '@core/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
// import { TokenModule } from '@modules/token/token.module';
import { RoleModule } from '@modules/role/role.module';
import { CaslModule } from '@core/casl/casl.module';

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
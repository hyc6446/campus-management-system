import { forwardRef, Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';
import { AuthCoreModule } from '@core/auth/auth.module';
import { RoleModule } from '@app/modules/role/role.module';
import { RuleConfigModule } from '@app/modules/rule-config/rule-config.module';
@Module({
  imports: [
    forwardRef(() => AuthCoreModule),
    RuleConfigModule,
    RoleModule,
  ],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService],
})
export class PermissionModule {}

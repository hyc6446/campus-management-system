import { forwardRef, Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './repositories/permission.repository';
import { AuthCoreModule } from '@core/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthCoreModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService],
})
export class PermissionModule {}

import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { AuthCoreModule } from '@core/auth/auth.module';
import { RoleRepository } from './repositories/role.repository';

@Module({
  imports: [
    AuthCoreModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
})
export class RoleModule {}

import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { AuthCoreModule } from '@core/auth/auth.module'
import { RoleRepository } from './role.repository'

@Module({
  imports: [AuthCoreModule],
  providers: [RoleService, RoleRepository],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}

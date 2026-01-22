import { Module } from '@nestjs/common'
import { RuleConfigService } from './rule-config.service'
import { RuleConfigController } from './rule-config.controller'
import { RuleConfigRepository } from './repositories/rule-config.repository'
import { AuthCoreModule } from '@core/auth/auth.module'
@Module({
  imports: [AuthCoreModule],
  providers: [RuleConfigService, RuleConfigRepository],
  exports: [RuleConfigService],
  controllers: [RuleConfigController],
})
export class RuleConfigModule {}

import { Module } from '@nestjs/common';
import { AuditLogController } from './auditLog.controller';
import { AuditLogService } from './auditLog.service';
import { AuthCoreModule } from '@core/auth/auth.module';
import { AuditLogRepository } from './repositories/auditLog.repository';
import { TokenModule } from '@modules/token/token.module';
import { CaslModule } from '@core/casl/casl.module';
@Module({
  imports: [
    AuthCoreModule,
    TokenModule,
    CaslModule,
  ],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogRepository],
  exports: [AuditLogService],
})
export class AuditLogModule {}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private configService: ConfigService) {}

  getAppInfo() {
    const appConfig = this.configService.get('app');
    return {
      name: appConfig.name,
      version: appConfig.version,
      env: appConfig.env,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
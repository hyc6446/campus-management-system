import { Controller, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from '@core/logger/logger.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @Inject(LoggerService) private readonly appLogger: LoggerService,
  ) {}
}
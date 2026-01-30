import { Controller, Inject, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @Inject(PinoLogger) private readonly appLogger: PinoLogger,
  ) {
    this.appLogger.setContext('AppController');
  }
}
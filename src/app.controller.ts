import { Controller, Get, HttpCode, HttpStatus, Inject, Logger, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from '@core/logger/logger.service';
import { ResponseUtil } from '@common/utils/response.util';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly appService: AppService,
    @Inject(LoggerService) private readonly appLogger: LoggerService,
  ) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  healthCheck() {
    this.logger.log('Health check requested');
    return ResponseUtil.success({ status: 'ok', timestamp: new Date().toISOString() });
  }

  @Get('info')
  getAppInfo() {
    const info = this.appService.getAppInfo();
    return ResponseUtil.success(info);
  }
  @Get('test-transform')
  testTransform() {
    return { message: 'This will be transformed by the interceptor' };
  }

  @Get('test-paginated')
  testPaginated(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    // 模拟分页数据
    const data = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);

    return {
      data: paginatedData,
      total: data.length,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  }
}
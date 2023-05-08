import { Controller, Get, Headers, Logger, Query } from '@nestjs/common';
import { OverviewDto } from 'src/dto/performance';
import { PerformanceService } from './performance.service';
@Controller('/v1/performance')
export class PerformanceController {
  constructor(
    private readonly performanceService: PerformanceService,
    private readonly logger: Logger,
  ) {}

  @Get('/overview')
  getOverviewIndex(
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
    @Query() query: OverviewDto,
  ) {
    this.logger.log('/v1/performance/overview: called', {
      ...query,
      app_env,
      app_id,
    });
    return this.performanceService.getOverview({ ...query, app_env, app_id });
  }
}

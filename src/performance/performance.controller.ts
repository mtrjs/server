import {
  Controller,
  Get,
  Headers,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetListDto, GetPerfDetailDto, OverviewDto } from 'src/dto/performance';
import { PerformanceService } from './performance.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('/v1/performance')
export class PerformanceController {
  constructor(
    private readonly performanceService: PerformanceService,
    private readonly logger: Logger,
  ) {}

  @Get('/overview')
  @UseGuards(JwtAuthGuard)
  getOverviewIndex(
    @Headers('app-id') appId: string,
    @Query() query: OverviewDto,
  ) {
    this.logger.log('/v1/performance/overview: called', {
      ...query,
      appId,
    });
    return this.performanceService.getOverview({
      ...query,
      appId,
    });
  }

  @Get('/list')
  @UseGuards(JwtAuthGuard)
  getList(@Query() query: GetListDto, @Headers('app-id') appId: string) {
    this.logger.log('/v1/performance/list: called', {
      ...query,
      appId,
    });
    return this.performanceService.getList({
      ...query,
      appId,
    });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getDetail(
    @Query() query: GetPerfDetailDto,
    @Headers('app-id') appId: string,
  ) {
    this.logger.log('/v1/performance: called', {
      ...query,
      appId,
    });
    return this.performanceService.getDetail({
      ...query,
      appId,
    });
  }
}

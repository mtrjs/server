import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DateFilterDto } from 'src/dto/common';
import { DeviceDto } from 'src/dto/overview';
import { OverviewService } from './overview.service';

@Controller('/v1/overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get('/stat')
  @UseGuards(JwtAuthGuard)
  async getStat(
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
    @Query() query: DateFilterDto,
  ) {
    return this.overviewService.getUserStat({ ...query, app_env, app_id });
  }

  @Get('/device')
  @UseGuards(JwtAuthGuard)
  async getDeviceInfo(
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
    @Query() query: DeviceDto,
  ) {
    return this.overviewService.getDeviceInfo({ ...query, app_env, app_id });
  }
}

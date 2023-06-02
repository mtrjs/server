import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DateFilterDto } from 'src/dto/common';
import { DeviceDto, GetChannelStatDto } from 'src/dto/overview';
import { OverviewService } from './overview.service';

@Controller('/v1/overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get('/stat')
  @UseGuards(JwtAuthGuard)
  async getStat(
    @Headers('app-id') app_id: string,
    @Query() query: DateFilterDto,
  ) {
    return this.overviewService.getUserStat({ ...query, app_id });
  }

  @Get('/device')
  @UseGuards(JwtAuthGuard)
  async getDeviceInfo(
    @Headers('app-id') app_id: string,
    @Query() query: DeviceDto,
  ) {
    return this.overviewService.getDeviceInfo({ ...query, app_id });
  }

  @Get('/channel-stat')
  async getChannelStat(
    @Headers('app-id') app_id: string,
    @Query() query: GetChannelStatDto,
  ) {
    return this.overviewService.getChannelStat({ ...query, app_id });
  }
}

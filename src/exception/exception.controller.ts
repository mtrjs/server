import { Controller, Get, Query, Headers, UseGuards } from '@nestjs/common';
import {
  GetExceptionListDto,
  GetJsExceptionDto,
  TrendDto,
} from '../dto/exception.dto';
import { ExceptionService } from './exception.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/v1/exception')
export class ExceptionController {
  constructor(private readonly exceptionService: ExceptionService) {}

  @Get('/js/trend')
  @UseGuards(JwtAuthGuard)
  async getJsTrend(
    @Headers('app-id') appId: string,
    @Headers('app-env') appEnv: string,
    @Query() query: TrendDto,
  ) {
    return this.exceptionService.getJsTrend({
      ...query,
      appEnv,
      appId,
    });
  }

  @Get('/resource/trend')
  @UseGuards(JwtAuthGuard)
  async getResourceTrend(
    @Headers('app-id') appId: string,
    @Headers('app-env') appEnv: string,
    @Query() query: TrendDto,
  ) {
    return this.exceptionService.getResourceTrend({
      ...query,
      appEnv,
      appId,
    });
  }

  @Get('/request/trend')
  @UseGuards(JwtAuthGuard)
  async getRequestTrend(
    @Headers('app-id') appId: string,
    @Headers('app-env') appEnv: string,
    @Query() query: TrendDto,
  ) {
    return this.exceptionService.getRequestTrend({
      ...query,
      appEnv,
      appId,
    });
  }

  @Get('/js/list')
  @UseGuards(JwtAuthGuard)
  async getJsExceptionList(
    @Query() params: GetExceptionListDto,
    @Headers('app-id') appId: string,
    @Headers('app-env') appEnv: string,
  ) {
    return this.exceptionService.getJsExceptionList({
      ...params,
      appId,
      appEnv,
    });
  }

  @Get('/request/list')
  @UseGuards(JwtAuthGuard)
  async getRequestExceptionList(
    @Query() params: GetExceptionListDto,
    @Headers('app-id') appId: string,
    @Headers('app-env') appEnv: string,
  ) {
    return this.exceptionService.getRequestExceptionList({
      ...params,
      appId,
      appEnv,
    });
  }

  @Get('/resource/list')
  @UseGuards(JwtAuthGuard)
  async getResourceExceptionList(
    @Query() params: GetExceptionListDto,
    @Headers('app-id') appId: string,
    @Headers('app-env') appEnv: string,
  ) {
    return this.exceptionService.getResourceExceptionList({
      ...params,
      appId,
      appEnv,
    });
  }

  @Get('/js')
  @UseGuards(JwtAuthGuard)
  async getJsException(
    @Query() query: GetJsExceptionDto,
    @Headers('app-id') appId: string,
    @Headers('app-env') appEnv: string,
  ) {
    return this.exceptionService.getJsException({
      ...query,
      appEnv,
      appId,
    });
  }
}

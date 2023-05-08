import { Controller, Get, Query, Headers } from '@nestjs/common';
import {
  GetConsoleListDto,
  GetExceptionListDto,
  GetJsExceptionDto,
  TrendDto,
} from '../dto/exception.dto';
import { ExceptionService } from './exception.service';

@Controller('/v1/exception')
export class ExceptionController {
  constructor(private readonly exceptionService: ExceptionService) {}

  @Get('/js/trend')
  async getJsTrend(
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
    @Query() query: TrendDto,
  ) {
    return this.exceptionService.getJsTrend({ ...query, app_env, app_id });
  }

  @Get('/resource/trend')
  async getResourceTrend(
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
    @Query() query: TrendDto,
  ) {
    return this.exceptionService.getResourceTrend({
      ...query,
      app_env,
      app_id,
    });
  }

  @Get('/request/trend')
  async getRequestTrend(
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
    @Query() query: TrendDto,
  ) {
    return this.exceptionService.getRequestTrend({ ...query, app_env, app_id });
  }

  @Get('/console/trend')
  async getConsoleTrend(
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
    @Query() query: TrendDto,
  ) {
    return this.exceptionService.getConsoleTrend({ ...query, app_env, app_id });
  }

  @Get('/js/list')
  async getJsExceptionList(
    @Query() params: GetExceptionListDto,
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
  ) {
    return this.exceptionService.getJsExceptionList({
      ...params,
      app_id,
      app_env,
    });
  }

  @Get('/request/list')
  async getRequestExceptionList(
    @Query() params: GetExceptionListDto,
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
  ) {
    return this.exceptionService.getRequestExceptionList({
      ...params,
      app_id,
      app_env,
    });
  }

  @Get('/resource/list')
  async getResourceExceptionList(
    @Query() params: GetExceptionListDto,
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
  ) {
    return this.exceptionService.getResourceExceptionList({
      ...params,
      app_id,
      app_env,
    });
  }

  @Get('/js')
  async getJsException(
    @Query() query: GetJsExceptionDto,
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
  ) {
    return this.exceptionService.getJsException({ ...query, app_env, app_id });
  }

  @Get('/console/list')
  async getConsoleList(
    @Query() query: GetConsoleListDto,
    @Headers('app-id') app_id: string,
    @Headers('app-env') app_env: string,
  ) {
    return this.exceptionService.getConsoleList({ ...query, app_id, app_env });
  }
}

import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as dayjs from 'dayjs';
import { Ip } from '../decorator/Ip';
import { ReportService } from './report.service';
import { Eid } from '../utils/constant';

@Controller('/v1/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(204)
  postReport(
    @Body()
    body: Record<string, any>,
    @Ip() ip: string,
  ) {
    const { list, href, traceId, appEnv, ua, appId } = body;

    const reportDatas = list.map((reportData) => {
      const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
      return {
        ...reportData,
        href,
        traceId,
        appEnv,
        ua,
        appId,
        ip,
        createdAt,
      };
    });
    if (Array.isArray(reportDatas)) {
      reportDatas.forEach((o) => {
        const { eid } = o;

        if (eid === Eid.performance) {
          this.reportService.performance(o);
        }
      });
    }
  }
}

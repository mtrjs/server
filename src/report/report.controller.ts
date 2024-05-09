import {
  Body,
  Controller,
  HttpCode,
  Logger,
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
  private readonly logger = new Logger(ReportController.name);
  constructor(private readonly reportService: ReportService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(204)
  postReport(
    @Body()
    body: ReportData,
    @Ip() ip: string,
  ) {
    const { list = [], href, traceId, appEnv, ua, appId } = body;
    try {
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
          console.log(o);

          switch (eid) {
            case Eid.performance:
              this.reportService.performance(o);
              break;
            case Eid.jsException:
              this.reportService.jsException(o);
              break;
            case Eid.requestException:
              this.reportService.requestException(o);
              break;
            case Eid.resourceException:
              this.reportService.resourceException(o);
              break;
          }
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}

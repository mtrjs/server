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

@Controller('/v1/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(204)
  postReport(
    @Body()
    body: {
      data: string;
    },
    @Ip() ip: string,
  ) {
    let reportDatas;
    try {
      reportDatas = JSON.parse(body.data);
    } catch (error) {
      console.log(error, '数据格式异常!');
    }
    if (Array.isArray(reportDatas)) {
      reportDatas = reportDatas.map((reportData) => {
        const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
        return { ...reportData, ip, createdAt };
      });
    }
    if (Array.isArray(reportDatas)) {
      reportDatas.forEach((o) => {
        const { eid } = o;

        if (eid === '1000') {
          this.reportService.performance(o);
        } else if (eid === '1003') {
          this.reportService.jsException(o);
        } else if (eid === '1004') {
          this.reportService.requestException(o);
        } else if (eid === '1006') {
          this.reportService.resourceException(o);
        } else if (eid === '1005') {
          this.reportService.consoleException(o);
        }
      });
    }
  }
}
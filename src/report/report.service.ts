import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsoleDocument } from 'src/schemas/console_exception.schema';
import { JsExceptionDocument } from 'src/schemas/js_exception.schema';
import { PerformanceDocument } from 'src/schemas/performance.schema';
import { RequestExceptionDocument } from 'src/schemas/request_exception.schema';
import { ResourceExceptionDocument } from 'src/schemas/resource_exception.schema';

interface ReportData {
  appId: string;
  traceId: string;
  t: string;
  eid: string;
  l: Record<string, any>;
}

@Injectable()
export class ReportService {
  constructor(
    @InjectModel('performance')
    private performanceModel: Model<PerformanceDocument>,
    @InjectModel('js_exception')
    private jsExceptionModel: Model<JsExceptionDocument>,
    @InjectModel('request_exception')
    private requestExceptionModel: Model<RequestExceptionDocument>,
    @InjectModel('resource_exception')
    private resourceExceptionModel: Model<ResourceExceptionDocument>,
    @InjectModel('console_exception')
    private consoleExceptionModel: Model<ConsoleDocument>,
  ) {}

  async performance(data: ReportData) {
    const { l, ...baseData } = data;
    try {
      await this.performanceModel.insertMany({
        ...baseData,
        ...l,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async jsException(data: ReportData) {
    const { l, ...baseData } = data;
    try {
      await this.jsExceptionModel.insertMany({
        ...baseData,
        ...l,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async requestException(data: ReportData) {
    const { l, ...baseData } = data;
    try {
      await this.requestExceptionModel.insertMany({
        ...baseData,
        ...l,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async resourceException(data: ReportData) {
    const { l, ...baseData } = data;
    try {
      await this.resourceExceptionModel.insertMany({
        ...baseData,
        ...l,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async consoleException(data: ReportData) {
    const { l, ...baseData } = data;
    try {
      await this.consoleExceptionModel.insertMany({
        ...baseData,
        ...l,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

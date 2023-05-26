import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PerformanceDocument } from 'src/schemas/performance.schema';

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
}

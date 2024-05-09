import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JsExceptionDocument } from 'src/schemas/js_exception.schema';
import { PerformanceDocument } from 'src/schemas/performance.schema';
import { RequestExceptionDocument } from 'src/schemas/request_exception.schema';
import { ResourceExceptionDocument } from 'src/schemas/resource_exception.schema';
import { CatchError } from 'src/utils/catchError';
import { SchemaName } from 'src/utils/constant';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(SchemaName.performance)
    private performanceModel: Model<PerformanceDocument>,
    @InjectModel(SchemaName.jsException)
    private jsExceptionModel: Model<JsExceptionDocument>,
    @InjectModel(SchemaName.requestException)
    private requestExceptionModel: Model<RequestExceptionDocument>,
    @InjectModel(SchemaName.resourceException)
    private resourceExceptionModel: Model<ResourceExceptionDocument>,
  ) {}

  @CatchError()
  async performance(data: PerformanceDocument[]) {
    await this.performanceModel.insertMany(data);
  }

  @CatchError()
  async jsException(data: JsExceptionDocument[]) {
    await this.jsExceptionModel.insertMany(data);
  }

  @CatchError()
  async requestException(data: RequestExceptionDocument[]) {
    await this.requestExceptionModel.insertMany(data);
  }

  @CatchError()
  async resourceException(data: ResourceExceptionDocument[]) {
    await this.resourceExceptionModel.insertMany(data);
  }
}

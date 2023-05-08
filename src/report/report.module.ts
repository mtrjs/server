import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PerformanceSchema } from '../schemas/performance.schema';
import { RequestExceptionSchema } from '../schemas/request_exception.schema';
import { JsExceptionSchema } from 'src/schemas/js_exception.schema';
import { ResourceExceptionSchema } from 'src/schemas/resource_exception.schema';
import { ConsoleSchema } from 'src/schemas/console_exception.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'performance', schema: PerformanceSchema },
      { name: 'request_exception', schema: RequestExceptionSchema },
      { name: 'js_exception', schema: JsExceptionSchema },
      { name: 'resource_exception', schema: ResourceExceptionSchema },
      { name: 'console_exception', schema: ConsoleSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PerformanceSchema } from '../schemas/performance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'performance', schema: PerformanceSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}

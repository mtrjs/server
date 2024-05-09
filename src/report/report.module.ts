import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PerformanceModule } from 'src/performance/performance.module';
import { ExceptionModule } from 'src/exception/exception.module';

@Module({
  imports: [PerformanceModule, ExceptionModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}

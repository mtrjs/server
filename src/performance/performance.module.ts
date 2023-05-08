import { Module } from '@nestjs/common';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { Logger } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [PerformanceController],
  providers: [PerformanceService, Logger],
})
export class PerformanceModule {}

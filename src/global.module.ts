import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceSchema } from './schemas/performance.schema';

const mongooseModule = MongooseModule.forFeature([
  { name: 'performance', schema: PerformanceSchema },
]);

@Global()
@Module({
  imports: [mongooseModule],
  exports: [mongooseModule],
})
export class GlobalModule {}

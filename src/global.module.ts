import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PerformanceSchema } from './schemas/performance.schema';
import { SchemaName } from './utils/constant';
import { JsExceptionSchema } from './schemas/js_exception.schema';
import { RequestExceptionSchema } from './schemas/request_exception.schema';
import { ResourceExceptionSchema } from './schemas/resource_exception.schema';

const mongooseModule = MongooseModule.forFeature([
  { name: SchemaName.performance, schema: PerformanceSchema },
  { name: SchemaName.jsException, schema: JsExceptionSchema },
  { name: SchemaName.requestException, schema: RequestExceptionSchema },
  { name: SchemaName.resourceException, schema: ResourceExceptionSchema },
]);

@Global()
@Module({
  imports: [mongooseModule],
  exports: [mongooseModule],
})
export class GlobalModule {}

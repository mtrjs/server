import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JsExceptionSchema } from 'src/schemas/js_exception.schema';
import { RequestExceptionSchema } from 'src/schemas/request_exception.schema';
import { ResourceExceptionSchema } from 'src/schemas/resource_exception.schema';
import { ExceptionController } from './exception.controller';
import { ExceptionService } from './exception.service';
import { SchemaName } from 'src/utils/constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SchemaName.jsException, schema: JsExceptionSchema },
      { name: SchemaName.requestException, schema: RequestExceptionSchema },
      { name: SchemaName.resourceException, schema: ResourceExceptionSchema },
    ]),
  ],
  controllers: [ExceptionController],
  providers: [ExceptionService],
})
export class ExceptionModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JsExceptionSchema } from 'src/schemas/js_exception.schema';
import { RequestExceptionSchema } from 'src/schemas/request_exception.schema';
import { ResourceExceptionSchema } from 'src/schemas/resource_exception.schema';
import { ConsoleSchema } from 'src/schemas/console_exception.schema';
import { ExceptionController } from './exception.controller';
import { ExceptionService } from './exception.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'js_exception', schema: JsExceptionSchema },
      { name: 'request_exception', schema: RequestExceptionSchema },
      { name: 'resource_exception', schema: ResourceExceptionSchema },
      { name: 'console_exception', schema: ConsoleSchema },
    ]),
  ],
  controllers: [ExceptionController],
  providers: [ExceptionService],
})
export class ExceptionModule {}

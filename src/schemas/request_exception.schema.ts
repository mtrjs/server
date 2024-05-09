import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaName } from 'src/utils/constant';

export type RequestExceptionDocument = RequestException & Document;

@Schema({ collection: SchemaName.requestException })
export class RequestException extends Document {
  @Prop()
  t: string;

  @Prop({ required: true })
  traceId: string;

  @Prop({ required: true })
  appId: string;

  @Prop()
  userId: string;

  @Prop()
  networkType: string;

  @Prop()
  ip: string;

  @Prop()
  ua: string;

  @Prop()
  createdAt: string;

  @Prop()
  method: string;

  @Prop()
  url: string;

  @Prop()
  startTime: number;

  @Prop()
  endTime: number;

  @Prop()
  type: string;

  @Prop()
  status: number;

  @Prop()
  statusText: string;

  @Prop()
  href?: string;

  @Prop()
  body?: string;

  @Prop()
  headers: string;
}

export const RequestExceptionSchema =
  SchemaFactory.createForClass(RequestException);

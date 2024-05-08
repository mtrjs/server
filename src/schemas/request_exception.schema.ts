import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaName } from 'src/utils/constant';

export type RequestExceptionDocument = RequestException & Document;

@Schema({ collection: SchemaName.requestException })
export class RequestException extends Document {
  @Prop({ required: true })
  eid: number;

  @Prop()
  t: number;

  @Prop({ required: true })
  trace_id: string;

  @Prop({ required: true })
  appId: string;

  @Prop({ required: true })
  appEnv: string;

  @Prop()
  user_id: string;

  @Prop()
  content_id: string;

  @Prop()
  content_name: string;

  @Prop()
  network_type: string;

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
  type: number;

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
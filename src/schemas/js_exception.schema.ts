import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaName } from '../utils/constant';

export type JsExceptionDocument = JsException & Document;

@Schema({ collection: SchemaName.jsException })
export class JsException extends Document {
  @Prop()
  t: string;

  @Prop({ required: true })
  traceId: string;

  @Prop({ required: true })
  appId: string;

  @Prop()
  userId: string;

  @Prop()
  ua: string;

  @Prop()
  ip: string;

  @Prop()
  createdAt: string;

  @Prop()
  colno: number;

  @Prop()
  name: string;

  @Prop()
  message: string;

  @Prop()
  filename: string;

  @Prop()
  lineno: number;

  @Prop()
  stack: string;

  @Prop()
  type: number;

  @Prop()
  count?: number;

  @Prop()
  href?: string;
}

export const JsExceptionSchema = SchemaFactory.createForClass(JsException);

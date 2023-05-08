import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JsExceptionDocument = JsException & Document;

@Schema({ collection: 'js_exception' })
export class JsException extends Document {
  @Prop({ required: true })
  eid: number;

  @Prop()
  t: number;

  @Prop({ required: true })
  trace_id: string;

  @Prop({ required: true })
  app_id: string;

  @Prop({ required: true })
  app_env: string;

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
  src?: string;

  @Prop()
  count?: number;

  @Prop()
  href?: string;
}

export const JsExceptionSchema = SchemaFactory.createForClass(JsException);

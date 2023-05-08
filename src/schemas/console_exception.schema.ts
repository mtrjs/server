import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConsoleDocument = ConsoleException & Document;

@Schema({ collection: 'console_exception' })
export class ConsoleException extends Document {
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
  ip: string;

  @Prop()
  ua: string;

  @Prop()
  createdAt: string;

  @Prop()
  colno: number;

  @Prop()
  messages: string;

  @Prop()
  href?: string;

  @Prop()
  type?: string;
}

export const ConsoleSchema = SchemaFactory.createForClass(ConsoleException);

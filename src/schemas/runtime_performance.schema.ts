import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RuntimePerformanceDocument = RuntimePerformance & Document;

@Schema({ collection: 'runtime_performance' })
export class RuntimePerformance extends Document {
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
  fps: number;

  @Prop()
  memory: number;

  @Prop()
  href?: string;
}

export const RuntimePerformanceSchema =
  SchemaFactory.createForClass(Performance);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PerformanceDocument = Performance & Document;

@Schema({ collection: 'performance' })
export class Performance extends Document {
  @Prop({ required: true })
  traceId: string;

  @Prop({ required: true })
  appId: string;

  @Prop()
  referrer: string;

  @Prop()
  ip: string;

  @Prop()
  ua: string;

  @Prop()
  createdAt: string;

  @Prop()
  unloadEventStart: number;

  @Prop()
  unloadEventEnd: number;

  @Prop()
  navigationStart: number;

  @Prop()
  redirectStart: string;

  @Prop()
  redirectEnd: string;

  @Prop()
  redirectCount: number;

  @Prop()
  fetchStart: number;

  @Prop()
  domainLookupStart: number;

  @Prop()
  domainLookupEnd: number;

  @Prop()
  connectStart: number;

  @Prop()
  secureConnectionStart: number;

  @Prop()
  connectEnd: number;

  @Prop()
  requestStart: number;

  @Prop()
  responseStart: number;

  @Prop()
  responseEnd: number;

  @Prop()
  domLoading: number;

  @Prop()
  domInteractive: number;

  @Prop()
  domContentLoadedEventEnd: number;

  @Prop()
  domContentLoadedEventStart: number;

  @Prop()
  domComplete: number;

  @Prop()
  loadEventStart: number;

  @Prop()
  loadEventEnd: number;

  @Prop()
  lcp: number;

  @Prop()
  fcp: number;

  @Prop()
  href?: string;

  @Prop()
  fid: number;

  @Prop()
  cls: number;

  @Prop()
  ttfb: number;

  @Prop()
  entryType: string;

  @Prop()
  decodedBodySize: number;

  @Prop()
  encodedBodySize: number;

  @Prop()
  name: string;

  @Prop()
  ntype: number; // 导航类型

  @Prop()
  t: string; // 客户端时间

  @Prop()
  duration: number;
}

export const PerformanceSchema = SchemaFactory.createForClass(Performance);

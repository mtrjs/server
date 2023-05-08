import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResourceExceptionDocument = ResourceException & Document;

@Schema({ collection: 'resource_exception' })
export class ResourceException extends Document {
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
  createdAt: string;

  @Prop()
  ua: string;

  @Prop()
  src?: string;

  @Prop()
  count?: number;

  @Prop()
  href?: string;
}

export const ResourceExceptionSchema =
  SchemaFactory.createForClass(ResourceException);

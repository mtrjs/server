import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SchemaName } from 'src/utils/constant';

export type ResourceExceptionDocument = ResourceException & Document;

@Schema({ collection: SchemaName.resourceException })
export class ResourceException extends Document {
  @Prop({ required: true })
  eid: number;

  @Prop()
  t: number;

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

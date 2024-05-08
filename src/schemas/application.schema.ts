import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ collection: 'application' })
export class Application extends Document {
  @Prop({ required: true })
  appId: string;

  @Prop()
  createdAt: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  name: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

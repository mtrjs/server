import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ collection: 'application' })
export class Application extends Document {
  @Prop({ required: true })
  env: string;

  @Prop({ required: true })
  app_id: string;

  @Prop()
  createdAt: string;

  @Prop({ required: true })
  user_id: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

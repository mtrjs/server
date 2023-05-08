import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'user' })
export class User extends Document {
  @Prop({ required: true })
  account: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

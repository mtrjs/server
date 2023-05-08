import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationSchema } from 'src/schemas/application.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'user', schema: UserSchema },
      { name: 'application', schema: ApplicationSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService],
})
export class UserModule {}

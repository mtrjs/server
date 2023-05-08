import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, PrismaService, AuthService, JwtService],
})
export class UserModule {}

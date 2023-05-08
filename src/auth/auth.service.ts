import { Injectable, Dependencies } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { jwtConstants } from './constants';

@Dependencies(JwtService, PrismaService)
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(user: User) {
    const { name, password } = user;
    try {
      const result = await this.prismaService.user.findFirst({
        where: {
          name,
          password,
        },
      });

      return result;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async login(user) {
    const payload = { name: user.name, uid: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
      }),
    };
  }
}

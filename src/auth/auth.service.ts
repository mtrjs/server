import { Injectable, Dependencies } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/user.schema';

@Dependencies(JwtService)
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('user')
    private userModel: Model<UserDocument>,
  ) {}

  async validateUser(user: User) {
    const { account, password } = user;
    try {
      const result = await this.userModel.findOne({
        account,
        password,
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

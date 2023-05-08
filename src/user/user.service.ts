import { Injectable } from '@nestjs/common';
import { CatchError } from '../utils/catchError';
import { AuthService } from '../auth/auth.service';
import { randomString } from '../utils/helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
import { ApplicationDocument } from 'src/schemas/application.schema';
import * as dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    @InjectModel('user')
    private userModel: Model<UserDocument>,
    @InjectModel('application')
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  @CatchError()
  async create(user: User) {
    const { account, password } = user;
    try {
      const result = await this.userModel.insertMany([{ account, password }]);
      return {
        code: 0,
        data: {
          ...result,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 登录
   *
   * @param {User} user
   * @memberof UserService
   */
  async login(user: User) {
    let userInfo = {};
    try {
      userInfo = await this.authService.validateUser(user);
      if (!userInfo) {
        return {
          code: 1,
          message: '账号或密码不正确!',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        code: 1,
        message: error.message,
      };
    }

    try {
      const { access_token } = await this.authService.login(userInfo);

      return {
        code: 0,
        data: {
          ...userInfo,
          access_token,
        },
      };
    } catch (error) {
      return {
        code: 1,
        message: error.message,
      };
    }
  }

  async getUser(data: { account: string }) {
    try {
      const result = await this.userModel.findOne({
        account: data.account,
      });

      const { _id, createdAt, account } = result;
      return {
        code: 0,
        data: {
          account,
          id: _id,
          createdAt,
        },
      };
    } catch (error) {
      return {
        code: 1,
        message: error.message,
      };
    }
  }

  @CatchError()
  async getApplication({ uid }: { uid: number }) {
    const result = await this.applicationModel.find({
      user_id: uid,
    });
    return {
      code: 0,
      data: result,
    };
  }

  @CatchError()
  async createApplication(data: Application & { uid: number }) {
    const { name, env, type, uid } = data;
    const app_id = randomString(8);

    const result = await this.applicationModel.insertMany([
      {
        name,
        type,
        env,
        app_id,
        user_id: uid,
        createdAt: dayjs().add(8, 'h').toISOString(),
      },
    ]);
    return {
      code: 0,
      data: result,
    };
  }
}

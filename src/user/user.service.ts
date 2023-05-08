import { Injectable } from '@nestjs/common';
import { CatchError } from '../utils/catchError';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../prisma.service';
import { randomString } from '../utils/helper';
import * as dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  @CatchError()
  async create(user: User) {
    const { name, password } = user;
    try {
      const result = await this.prismaService.user.create({
        data: { name, password },
      });
      console.log(result);
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

  async getUser({ name }: { name: string }) {
    try {
      const result = await this.prismaService.user.findFirst({
        where: { name },
      });
      const { id, createdAt } = result;
      return {
        code: 0,
        data: {
          name: result.name,
          id,
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
    const result = await this.prismaService.application.findMany({
      where: { user_id: uid },
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

    const result = await this.prismaService.application.create({
      data: {
        name,
        type,
        env,
        app_id,
        user_id: uid,
        createdAt: dayjs().add(8, 'h').toISOString(),
      },
    });
    return {
      code: 0,
      data: result,
    };
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateApplicationDto, LoginDto } from 'src/dto/user';
import { UserService } from './user.service';

@Controller('/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req) {
    const { name } = req.user;
    return this.userService.getUser({ name });
  }

  @Post('/login')
  async login(@Body() user: LoginDto) {
    return this.userService.login(user);
  }

  @Get('/application/list')
  @UseGuards(JwtAuthGuard)
  async getApplication(@Request() req) {
    const { uid } = req.user;
    return this.userService.getApplication({ uid });
  }

  @Post('/application')
  @UseGuards(JwtAuthGuard)
  async createApplication(@Request() req, @Body() data: CreateApplicationDto) {
    const { uid } = req.user;
    return this.userService.createApplication({ ...data, uid });
  }
}

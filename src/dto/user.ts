import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  account: string;

  @IsString()
  password: string;
}

export class CreateApplicationDto {
  @IsString()
  name: string;
}

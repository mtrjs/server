import { IsOptional, IsString } from 'class-validator';
import { PagerDto } from '../dto/common';

export class GetExceptionListDto extends PagerDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  startAt: string;

  @IsString()
  @IsOptional()
  endAt: string;
}

export class TrendDto {
  @IsString()
  @IsOptional()
  startAt: string;

  @IsString()
  @IsOptional()
  endAt: string;
}

export class GetJsExceptionDto extends PagerDto {
  @IsString()
  id: string;
}

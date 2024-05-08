import { IsOptional, IsString } from 'class-validator';
import { PagerDto } from './common';

export class OverviewDto {
  @IsString()
  @IsOptional()
  startAt: string;

  @IsString()
  @IsOptional()
  endAt: string;
}

export class GetListDto extends PagerDto {
  @IsString()
  @IsOptional()
  sortColumn: string;

  @IsString()
  @IsOptional()
  sortStatus: string;

  @IsString()
  @IsOptional()
  name: string;
}

export class GetPerfDetailDto {
  @IsString()
  id: string;
}

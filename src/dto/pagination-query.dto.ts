// dto/pagination-query.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  readonly limit?: number;

  @IsOptional()
  @IsNumber()
  readonly page?: number;

  @IsOptional()
  @IsNumber()
  readonly offset?: number;

  @IsOptional()
  @IsString()
  readonly search?: string;
}

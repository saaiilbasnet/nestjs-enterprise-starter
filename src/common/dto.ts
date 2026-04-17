import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { transformToNum } from 'src/helpers/utils';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @Transform(transformToNum)
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiPropertyOptional({ default: 10 })
  @Transform(transformToNum)
  @IsNumber()
  @IsOptional()
  take: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ default: 'some name' })
  searchTerm: string;
}

export class SearchTermDTO {
  @ApiProperty({ description: 'Search Term', default: null })
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
export class OptionalSearchTermDTO extends PartialType(SearchTermDTO) {}

export class PaginationDTO {
  @ApiProperty({
    default: 1,
    type: Number,
    description: 'Current page number (starts from 1)',
  })
  @Type(() => Number)
  @IsPositive()
  page: number;

  @ApiProperty({
    default: 10,
    type: Number,
    description: 'Number of items per page',
  })
  @Type(() => Number)
  @IsPositive()
  take: number;
}

export class OptionalPagination extends PartialType(PaginationDTO) {}

export class PagingationWithSearchTermDTO extends IntersectionType(
  PaginationDTO,
  OptionalSearchTermDTO,
) {}

export class optionalPagiSearchTermDTO extends IntersectionType(
  OptionalPagination,
  OptionalSearchTermDTO,
) {}

export class IdDTO {
  @ApiProperty({ example: 1, description: 'Positive Number ' })
  @IsOptional()
  id: string;
}
export class OptionalIdDTO {
  @ApiPropertyOptional({ example: '1', description: 'Positive Number ' })
  @IsOptional()
  id?: string;
}

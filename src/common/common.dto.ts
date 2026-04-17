import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
} from 'class-validator';
export class EmailDTO {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;
}
export class TitleDTO {
  @ApiProperty({ default: 'Title Of The Entity', maxLength: 255 })
  @IsString()
  @Length(2, 255)
  title!: string;
}
export class ShortTitleDTO {
  @ApiProperty({ minLength: 2, maxLength: 50 })
  // @Trim()
  @IsString()
  @Length(2, 50)
  shortTitle!: string;
}
export class DescriptionDTO {
  @ApiPropertyOptional({ default: 'Detailed description' })
  @IsOptional()
  // @Trim()
  @IsString()
  description?: string;
}
export class TitleDescriptionDTO extends IntersectionType(
  TitleDTO,
  DescriptionDTO,
) {}
export class IdDTO {
  @ApiProperty({ example: '1', description: 'Positive Numeric ID' })
  @IsNumberString()
  id!: string;
}
export class TagDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tag!: string;
}
export class StatusDTO {
  @ApiProperty({ type: Boolean, default: true, description: 'true for active' })
  @Type(() => Boolean)
  @IsBoolean()
  status!: boolean;
}
export class SlugDTO {
  @ApiProperty({ example: 'my-unique-slug' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(520)
  slug!: string;
}
export class SlugStatusDTO extends IntersectionType(SlugDTO, StatusDTO) {}

export class CategoryIdDTO {
  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  categoryId!: number;
}
export class ParentIdDTO {
  @ApiPropertyOptional({ description: 'ID of the parent' })
  @IsOptional()
  @IsNumber()
  parentId?: number;
}

export class QueryWithPage {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page!: number;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take!: number;
}

export class QueryWithpageAndSearch extends QueryWithPage {
  @ApiPropertyOptional({
    description: 'search term',
    example: null,
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}

export class SlugSEODTO extends PartialType(SlugDTO) {
  @ApiPropertyOptional({
    description: 'Meta title for SEO purposes',
    maxLength: 600,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(600)
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta keywords for SEO',
    maxLength: 600,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(600)
  metaKeywords?: string;

  @ApiPropertyOptional({
    description: 'Meta description for SEO',
    type: String,
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;
}

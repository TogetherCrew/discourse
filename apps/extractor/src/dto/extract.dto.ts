import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ExtractDto {
  @ApiProperty()
  @IsNotEmpty()
  endpoint: string;
}

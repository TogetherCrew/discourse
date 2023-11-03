import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateForumDto {
  @ApiProperty()
  @IsNotEmpty()
  endpoint: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class ExtractDto {
  @ApiProperty()
  @IsNotEmpty()
  platform_id: string;

  @ApiProperty({ required: false })
  from_topic_id: number;

  @ApiProperty({ required: false })
  from_post_id: number;
}

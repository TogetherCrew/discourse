import {
  Controller,
  Post,
  Body,
  Put,
  HttpStatus,
  HttpCode,
  Param,
} from '@nestjs/common';
import { ForumsService } from './forums.service';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';

@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Post()
  create(@Body() createForumDto: CreateForumDto) {
    return this.forumsService.create(createForumDto);
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('uuid') uuid: string, @Body() updateForumDto: UpdateForumDto) {
    return this.forumsService.update(uuid, updateForumDto);
  }
}

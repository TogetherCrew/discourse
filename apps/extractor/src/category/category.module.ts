import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule { }

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from '../../helpers/auth/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from '../../entities/categories.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from '../dtos/createCategory.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesEntity: Repository<CategoriesEntity>,
    private categoriesService: CategoriesService,
  ) {}
  @Post('/add')
  async newCategory(@Body() categoryData: CreateCategoryDto) {
    try {
      await this.categoriesService.createCategory(categoryData);
      return categoryData;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Put('/:id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() body: CreateCategoryDto,
  ): Promise<CreateCategoryDto> {
    try {
      await this.categoriesService.updateCategory(categoryId, body);
      return body;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException(error.message);
      }
    }
  }

  // @Todo jak zrobić żeby podczas usuwania kategorii nie usuwało mi operacji z daną kategoria i tak samo może być problem z updatem
  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoriesService.deleteCategory(id);
  }

  @Get()
  async getCategories() {
    return await this.categoriesEntity.find();
  }

  @Get('/:id')
  async getSingleCategory(@Param('id') categoryId: string) {
    return this.categoriesEntity.findOne({
      where: {
        id: categoryId,
      },
    });
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesEntity } from '../../entities/categories.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../dtos/createCategory.dto';
import { CashFlowService } from '../cashFlow/cashFlow.service';
import { FilterOperationsDto } from '../dtos/filterOperations.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesEntity: Repository<CategoriesEntity>,
    private categoriesService: CategoriesService,
    private cashFlowService: CashFlowService,
  ) {}
  @Post('/add')
  async newCategory(@Body() categoryData: CreateCategoryDto) {
    try {
      await this.categoriesService.createCategory(categoryData);
      return categoryData;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Wybrana kategoria już istnieje!');
      }
    }
  }

  @Put('/:id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<UpdateCategoryDto> {
    try {
      await this.categoriesService.updateCategory(categoryId, {
        name: body.name,
      });
      return body;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Wybrana kategoria już istnieje!');
      }
    }
  }

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
  @Get('/all/:id')
  async getAllOperationsByCategory(
    @Query() filterDto: FilterOperationsDto,
    @Param('id')
    categoryId: string,
  ) {
    if (filterDto.month === '' && filterDto.year === '') {
      return this.cashFlowService.getCategoryDetails(categoryId);
    }

    if (filterDto.month || filterDto.year === '') {
      return this.cashFlowService.getOperationsWithFilters(
        categoryId,
        filterDto,
      );
    }

    if (Object.keys(filterDto).length) {
      return this.cashFlowService.getOperationsWithFilters(
        categoryId,
        filterDto,
      );
    }
  }
}

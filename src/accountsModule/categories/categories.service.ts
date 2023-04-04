import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CategoriesEntity } from '../../entities/categories.entity';
import { CreateCategoryDto } from '../dtos/createCategory.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesEntity)
    private categoriesEntity: Repository<CategoriesEntity>,
  ) {}
  async createCategory(
    categoryData: CreateCategoryDto,
  ): Promise<CategoriesEntity> {
    return this.categoriesEntity.save(categoryData);
  }

  async updateCategory(
    operationId: string,
    body: CreateCategoryDto,
  ): Promise<UpdateResult> {
    return this.categoriesEntity.update(operationId, body);
  }

  async deleteCategory(categoryId: string) {
    const result = await this.categoriesEntity.delete(categoryId);

    if (result.affected === 0) {
      throw new NotFoundException('Category not found!');
    }

    return {
      affected: result.affected,
    };
  }
}

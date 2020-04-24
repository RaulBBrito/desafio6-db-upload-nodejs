import { getCustomRepository } from 'typeorm';
import { uuid } from 'uuidv4';

import Category from '../models/Category';

import CategoriesRepository from '../repositories/CategoriesRepository';

class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const findCategory = await categoriesRepository.findOne({
      where: { title },
    });

    if (findCategory) {
      return findCategory;
    }

    const createCategory = categoriesRepository.create({
      id: uuid(),
      title,
    });

    await categoriesRepository.save(createCategory);
    return createCategory;
  }
}

export default CreateCategoryService;

import type { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository'
import type { Category } from '~/app/models/Category'

export class CategoryService {
  constructor(private repository: ICategoryRepository) {}

  async listCategories(): Promise<Category[]> {
    return this.repository.findAll()
  }

  async getCategoryDetails(id: number): Promise<Category> {
    if (!id || id <= 0) {
      throw new Error('Invalid category ID')
    }
    return this.repository.findById(id)
  }
}

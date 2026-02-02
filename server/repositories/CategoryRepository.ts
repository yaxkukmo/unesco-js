import BaseRepository from './BaseRepository'
import type { Category } from '~/app/models/Category'
import type { ICategoryRepository } from './interfaces/ICategoryRepository'

export class CategoryRepository extends BaseRepository implements ICategoryRepository {
  private endpoint = '/api/categories'

  async findAll(): Promise<Category[]> {
    const client = await this.getClient()
    return client(this.endpoint)
  }

  async findById(id: number): Promise<Category> {
    const client = await this.getClient()
    return client(`${this.endpoint}/${id}`)
  }
}

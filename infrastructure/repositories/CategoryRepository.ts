import BaseRepository from './BaseRepository'
import type { Category } from '~/shared/types/Category'
import type { ICategoryRepository } from '~/domain/ports/ICategoryRepository'

export class CategoryRepository extends BaseRepository implements ICategoryRepository {
  private endpoint = '/api/categories'

  async findAll(): Promise<Category[]> {
    const client = await this.getClient()
    const response =  await client(this.endpoint)
    return response.data;
  }

  async findById(id: number): Promise<Category> {
    const client = await this.getClient()
    const response =  await client(`${this.endpoint}/${id}`)
    return response.data;
  }
}

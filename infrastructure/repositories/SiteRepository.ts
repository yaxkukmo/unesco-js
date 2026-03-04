import BaseRepository from './BaseRepository'
import type { Site } from '~/shared/types/Site'
import type { ISiteRepository } from '~/domain/ports/ISiteRepository'
import type { ApiResponse } from '~/shared/types/ApiResponse'

export class SiteRepository extends BaseRepository implements ISiteRepository {
  private endpoint = '/api/sites'

  async findAll(filters?: {
    country?: number
    category?: number
    perPage?: number
    page?: number
  } = {}): Promise<ApiResponse<Site[]>> {
    const client = await this.getClient()
    const params = new URLSearchParams(
      Object.entries(filters).filter(
        ([key, value]) => { 
          return value !== undefined && value !== null && value !== ''
        }
      )
    ).toString()
    const url = params ? `${this.endpoint}?${params}` : this.endpoint
    return await client<Site[]>(url)
  }

  async findById(id: number): Promise<Site> {
    const client = await this.getClient()
    const response = await client<Site>(`${this.endpoint}/${id}`)
    return response.data
  }

}

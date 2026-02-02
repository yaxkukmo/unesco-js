import type { ISiteRepository } from '../repositories/interfaces/ISiteRepository'
import type { Site } from '~/app/models/Site'
import type { ApiResponse } from '~/app/models/ApiResponse.types'

export class SiteService {
  constructor(private repository: ISiteRepository) { }

  async listSites(filters?: {
    country?: number
    category?: string
    page?: number
    perPage?: number
  }): Promise<ApiResponse<Site[]>> {

    if (filters?.page && filters.page < 1) {
      throw new Error('Page must be >= 1')
    }

    return await this.repository.findAll(filters)
  }

  async getSiteDetails(id: number): Promise<Site> {

    if (id <= 0) {
      throw new Error('Invalid site Id')
    }

    return this.repository.findById(id)
  }
}

import type { Site } from '~/app/models/Site'

export interface ISiteRepository {
    findAll(filters?: {
      country?: number
      category?: string
      page?: number
      perPage?: number
    }): Promise<{ data: Site[], total: number}>

    findById(id: number): Promise<Site>


}

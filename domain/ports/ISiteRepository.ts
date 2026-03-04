import type { Site } from '~/shared/types/Site'

export interface ISiteRepository {
    findAll(filters?: {
      country?: number
      category?: number
      page?: number
      perPage?: number
    }): Promise<{ data: Site[], total: number}>

    findById(id: number): Promise<Site>


}

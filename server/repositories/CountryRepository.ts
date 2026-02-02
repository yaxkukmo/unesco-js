import BaseRepository from './BaseRepository'
import type { Country } from '~/app/models/Country'
import type { ICountryRepository } from './interfaces/ICountryRepository'

export class CountryRepository extends BaseRepository implements ICountryRepository {
  private endpoint = '/api/countries'

  async findAll(): Promise<Country[]> {
    const client = await this.getClient()
    const response =  await client(this.endpoint)
    return response.data
  }

  async findById(id: number): Promise<Country> {
    const client = await this.getClient()
    const response = client(`${this.endpoint}/${id}`)
    return response.data
  }
}

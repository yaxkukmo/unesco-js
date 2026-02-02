import type { ICountryRepository } from '../repositories/interfaces/ICountryRepository'
import type { Country } from '~/app/models/Country'

export class CountryService {
  constructor(private repository: ICountryRepository) {}

  async listCountries(): Promise<Country[]> {
    return this.repository.findAll()
  }

  async getCountryDetails(id: number): Promise<Country> {
    if (!id || id <= 0) {
      throw new Error('Invalid country ID')
    }
    return this.repository.findById(id)
  }
}

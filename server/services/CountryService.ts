import type { ICountryRepository } from '~/domain/ports/ICountryRepository'
import type { Country } from '~/shared/types/Country'

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

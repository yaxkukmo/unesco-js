import type { Country } from '~/app/models/Country'

export interface ICountryRepository {
    findAll(): Promise<{ data: Country[]}>

    findById(id: number): Promise<Country>
}

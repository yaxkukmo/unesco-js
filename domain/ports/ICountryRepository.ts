import type { Country } from '~/shared/types/Country'

export interface ICountryRepository {
    findAll(): Promise<{ data: Country[]}>

    findById(id: number): Promise<Country>
}

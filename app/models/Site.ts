import type {Country} from './Country'
import type {Category} from './Category'

export interface Site {
  id: int
  name: string
  description?: string
  latitude: number
  longitude: number
  image_url: string
  wikipedia_url: string
  country: Country
  categories: Category[]
}

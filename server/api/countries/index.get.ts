import { container } from '../../utils/container'

export default defineEventHandler(async (event) => {
    const service = container.getCountryService()
    return service.listCountries()
})

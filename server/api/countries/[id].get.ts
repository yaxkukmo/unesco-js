import { container } from '../../utils/container'

export default defineEventHandler(async (event) => {
  const service = container.getCountryService()
  const id = Number(event.context.params.id)
  return service.getCountryDetails(id)
})

import { container } from '../../utils/container'

export default defineEventHandler(async (event) => {
  const service = container.getSiteService()
  const id = Number(event.context.params!.id)
  return service.getSiteDetails(id)
})

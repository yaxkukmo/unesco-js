import { container } from '../../utils/container'

export default defineEventHandler(async (event) => {
  const service = container.getCategoryService()
  const id = Number(event.context.params.id)
  return service.getCategoryDetails(id)
})

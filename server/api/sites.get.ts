import { container } from '../utils/container'

export default defineEventHandler(async (event) => {
  const service = container.getSiteService()
  const query = getQuery(event)

  return service.listSites({
    country: query.country ? Number(query.country) : null,
    category: query.category as number,
    page: query.page ? Number(query.page): 1,
    perPage: query.perPage ? Number(query.perPage): 10
  })
})

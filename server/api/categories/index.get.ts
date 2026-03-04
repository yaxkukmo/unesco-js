import { container } from '../../utils/container'

export default defineEventHandler(async (event) => {
    const service = container.getCategoryService()
    return service.listCategories()
})

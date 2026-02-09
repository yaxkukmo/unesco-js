import { it, describe, expect, vi, beforeEach } from 'vitest'
import { SiteRepository } from '~/infrastructure/repositories/SiteRepository'
import { apiClient } from '~/server/utils/apiUtils'

vi.mock('~/server/utils/apiUtils', () => ({
  apiClient: vi.fn()
}))


describe('SiteRepository', () => {
  let repository: SiteRepository
  let clientMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    clientMock = vi.fn()
    vi.mocked(apiClient).mockResolvedValue(clientMock)

    repository = new SiteRepository()
  })

  describe('findAll', () => {
    it('should fetch all sites', async () => {
      clientMock.mockResolvedValue({
        success: true,
        data: [{ id: 1, name: 'site 1' }],
        meta: { total: 100, lastPage: 10 }
      })
      const result = await repository.findAll()

      expect(clientMock).toHaveBeenCalledWith('/api/sites')
      console.log(result)
      expect(result.meta.total).toBe(100)
      expect(result.data).toHaveLength(1)
      expect(result.meta.lastPage).toBe(10)
    })

    it('should add filters to URL', async () => {
      clientMock.mockResolvedValue({
        data: { id: 1, name: 'Test Site' },
        meta: { total: 100, last_page: 10 }
      })

      const site = await repository.findAll({country: 5, page: 10})

      expect(clientMock).toHaveBeenCalledWith(expect.stringContaining('country=5'))
      expect(clientMock).toHaveBeenCalledWith(expect.stringContaining('page=10'))
    })
  })

  describe('findById', () => {
    it('should fetch by id', async () => {
      clientMock.mockResolvedValue({
        data: {
          id: 1,
          name: 'site 1'
        }
      })
      const result = await repository.findById(1)

      expect(result).toStrictEqual({ id: 1, name: 'site 1' })
      expect(clientMock).toHaveBeenCalledWith('/api/sites/1')
    })
  })
})

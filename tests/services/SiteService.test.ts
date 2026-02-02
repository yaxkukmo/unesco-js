import { describe, it, vi, expect } from 'vitest'
import { SiteService } from '~/server/services/SiteService'

describe('SiteService', () => {

  it('should validate site ID', async () => {
    const repositoryMock = {
      findById: vi.fn().mockResolvedValue({id: 1, name: 'Test'})
    }
    const service = new SiteService(repositoryMock)
    const site = await service.getSiteDetails(1)

    expect(site.name).toBe('Test')
    expect(repositoryMock.findById).toHaveBeenCalledWith(1)
  })

  it('should throw an site Id error', async () => {
    const service = new SiteService({} as any)
    await expect(service.getSiteDetails(0)).rejects.toThrow('Invalid site Id')
  })

  it('should throw page number error', async () => {
    const service = new SiteService({} as any)
    await expect(service.listSites({page: -1})).rejects.toThrow('Page must be >= 1')
  })

  it('should validate page number', async () => {
    const repositoryMock = {
      findAll: vi.fn().mockResolvedValue({data: [{id: 1, name: 'testSite'}], total: 1, lastPage: 1})
    }
    const service = new SiteService(repositoryMock)
    const results = await service.listSites({page: 1})
    expect(results).toStrictEqual({data: [{id: 1, name: 'testSite'}], total: 1, lastPage: 1})
    expect(repositoryMock.findAll).toHaveBeenCalledOnce()
  })

})

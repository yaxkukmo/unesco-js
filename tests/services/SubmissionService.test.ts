import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubmissionService } from '~/server/services/SubmissionService'
import { SiteSubmission } from '~/domain/site/entities/SiteSubmission'
import { SiteStatus } from '~/domain/site/enums/SiteStatus'
import { SiteName } from '~/domain/site/value_objects/SiteName'
import { Description } from '~/domain/site/value_objects/Description'
import { ExternalUrl } from '~/domain/site/value_objects/ExternalUrl'
import { Coordinates } from '~/domain/site/value_objects/Coordinates'

const createMockSubmission = () => {
  return SiteSubmission.create(
    'test-uuid',
    SiteName.create('Test Site'),
    Description.create('A test site description'),
    ExternalUrl.create('https://example.com'),
    Coordinates.create(50, 20)
  )
}

describe('SubmissionService', () => {
  let service: SubmissionService
  let repoMock: any

  beforeEach(() => {
    repoMock = {
      save: vi.fn().mockImplementation((site) => Promise.resolve(site)),
      findById: vi.fn(),
      findByAuthor: vi.fn(),
      findByStatus: vi.fn()
    }
    service = new SubmissionService(repoMock)
  })

  describe('create', () => {
    it('should create submission and return uuid', async () => {
      const uuid = await service.create({
        name: 'Wawel Castle',
        description: 'A historic castle',
        externalUrl: 'https://example.com',
        latitude: 50,
        longitude: 20
      })

      expect(uuid).toBeDefined()
      expect(typeof uuid).toBe('string')
      expect(repoMock.save).toHaveBeenCalledOnce()
    })

    it('should reject invalid data (empty name)', async () => {
      await expect(service.create({
        name: '',
        description: 'A historic castle',
        externalUrl: 'https://example.com',
        latitude: 50,
        longitude: 20
      })).rejects.toThrow('Name cannot be empty')
    })

    it('should reject invalid coordinates', async () => {
      await expect(service.create({
        name: 'Test',
        description: 'A historic castle',
        externalUrl: 'https://example.com',
        latitude: 91,
        longitude: 20
      })).rejects.toThrow('Invalid latitude')
    })

    it('should reject invalid URL', async () => {
      await expect(service.create({
        name: 'Test',
        description: 'A historic castle',
        externalUrl: 'not-a-url',
        latitude: 50,
        longitude: 20
      })).rejects.toThrow('URL must be in standard format')
    })
  })

  describe('approve', () => {
    it('should approve and return Approved status', async () => {
      repoMock.findById.mockResolvedValue(createMockSubmission())

      const status = await service.approve('test-uuid')

      expect(status).toBe(SiteStatus.Approved)
      expect(repoMock.save).toHaveBeenCalledOnce()
    })

    it('should throw if submission not found', async () => {
      repoMock.findById.mockResolvedValue(null)

      await expect(service.approve('nonexistent'))
        .rejects.toThrow('Submission not found')
    })
  })

  describe('reject', () => {
    it('should reject and return Rejected status', async () => {
      repoMock.findById.mockResolvedValue(createMockSubmission())

      const status = await service.reject('test-uuid', 'This submission does not meet the quality standards')

      expect(status).toBe(SiteStatus.Rejected)
      expect(repoMock.save).toHaveBeenCalledOnce()
    })

    it('should throw if submission not found', async () => {
      repoMock.findById.mockResolvedValue(null)

      await expect(service.reject('nonexistent', 'Some long enough reason here'))
        .rejects.toThrow('Submission not found')
    })

    it('should throw if reason is too short', async () => {
      repoMock.findById.mockResolvedValue(createMockSubmission())

      await expect(service.reject('test-uuid', 'too short'))
        .rejects.toThrow('Rejection reason must be at least 20 characters')
    })
  })

  describe('getPending', () => {
    it('should call repository with PendingReview status', async () => {
      repoMock.findByStatus.mockResolvedValue([])

      await service.getPending()

      expect(repoMock.findByStatus).toHaveBeenCalledWith(SiteStatus.PendingReview)
    })
  })
})

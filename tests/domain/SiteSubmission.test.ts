import { describe, it, expect } from 'vitest'
import { SiteSubmission } from '~/domain/site/entities/SiteSubmission'
import { SiteStatus } from '~/domain/site/enums/SiteStatus'
import { SiteName } from '~/domain/site/value_objects/SiteName'
import { Description } from '~/domain/site/value_objects/Description'
import { ExternalUrl } from '~/domain/site/value_objects/ExternalUrl'
import { Coordinates } from '~/domain/site/value_objects/Coordinates'

const createSubmission = () => {
  return SiteSubmission.create(
    'test-uuid-123',
    SiteName.create('Wawel Castle'),
    Description.create('A historic castle in Krakow'),
    ExternalUrl.create('https://en.wikipedia.org/wiki/Wawel'),
    Coordinates.create(50.0540, 19.9354)
  )
}

describe('SiteSubmission', () => {
  it('should create with PendingReview status', () => {
    const submission = createSubmission()
    expect(submission.getStatus()).toBe(SiteStatus.PendingReview)
  })

  it('should have correct uuid', () => {
    const submission = createSubmission()
    expect(submission.uuid).toBe('test-uuid-123')
  })

  describe('approve', () => {
    it('should approve pending submission', () => {
      const submission = createSubmission()
      submission.approve()
      expect(submission.getStatus()).toBe(SiteStatus.Approved)
    })

    it('should reject approving already approved submission', () => {
      const submission = createSubmission()
      submission.approve()
      expect(() => submission.approve()).toThrow('Only pending submissions can be approved')
    })

    it('should reject approving rejected submission', () => {
      const submission = createSubmission()
      submission.reject()
      expect(() => submission.approve()).toThrow('Only pending submissions can be approved')
    })
  })

  describe('reject', () => {
    it('should reject pending submission', () => {
      const submission = createSubmission()
      submission.reject()
      expect(submission.getStatus()).toBe(SiteStatus.Rejected)
    })

    it('should reject rejecting already rejected submission', () => {
      const submission = createSubmission()
      submission.reject()
      expect(() => submission.reject()).toThrow('Only pending submissions can be rejected')
    })

    it('should reject rejecting approved submission', () => {
      const submission = createSubmission()
      submission.approve()
      expect(() => submission.reject()).toThrow('Only pending submissions can be rejected')
    })
  })
})

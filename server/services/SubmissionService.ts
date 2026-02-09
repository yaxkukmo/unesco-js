import { SiteSubmission } from '~/domain/site/entities/SiteSubmission'
import { SiteStatus } from '~/domain/site/enums/SiteStatus'
import { SiteName } from '~/domain/site/value_objects/SiteName'
import { Description } from '~/domain/site/value_objects/Description'
import { ExternalUrl } from '~/domain/site/value_objects/ExternalUrl'
import { Coordinates } from '~/domain/site/value_objects/Coordinates'
import type { ISubmissionRepository } from '~/infrastructure/repositories/interfaces/ISubmissionRepository'

export type SubmissionData = {
  name: string
  description: string
  externalUrl: string
  latitude: number
  longitude: number
}

export class SubmissionService {
  constructor(private repository: ISubmissionRepository) {}

  async create(data: SubmissionData): Promise<string> {
    const site = SiteSubmission.create(
      crypto.randomUUID(),
      SiteName.create(data.name),
      Description.create(data.description),
      ExternalUrl.create(data.externalUrl),
      Coordinates.create(data.latitude, data.longitude)
    )
    await this.repository.save(site)
    return site.uuid
  }

  async approve(id: string): Promise<SiteStatus> {
    const site = await this.repository.findById(id)
    if (!site) throw new Error('Submission not found')

    site.approve()
    await this.repository.save(site)
    return site.getStatus()
  }

  async reject(id: string, reason: string): Promise<SiteStatus> {
    const site = await this.repository.findById(id)
    if (!site) throw new Error('Submission not found')
    if (reason.trim().length < 20) throw new Error('Rejection reason must be at least 20 characters')

    site.reject()
    await this.repository.save(site)
    return site.getStatus()
  }

  async getByAuthor(authorId: number): Promise<SiteSubmission[]> {
    return this.repository.findByAuthor(authorId)
  }

  async getPending(): Promise<SiteSubmission[]> {
    return this.repository.findByStatus(SiteStatus.PendingReview)
  }
}

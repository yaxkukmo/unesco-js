import { SiteName } from '~/domain/site/value_objects/SiteName'
import { Description } from '~/domain/site/value_objects/Description'
import { ExternalUrl } from '~/domain/site/value_objects/ExternalUrl'
import { Coordinates } from '~/domain/site/value_objects/Coordinates'
import { SiteStatus } from '~/domain/site/enums/SiteStatus'

export class SiteSubmission {
  private status: SiteStatus

  private constructor(
    public readonly uuid: string,
    public readonly name: SiteName,
    public readonly description: Description,
    public readonly externalUrl: ExternalUrl,
    public readonly coordinates: Coordinates,
    status: SiteStatus
  ) {
    this.status = status
  }

  approve(): void {
    if (this.status !== SiteStatus.PendingReview) {
      throw new Error('Only pending submissions can be approved')
    }
    this.status = SiteStatus.Approved
  }

  reject(): void {
    if (this.status !== SiteStatus.PendingReview) {
      throw new Error('Only pending submissions can be rejected')
    }
    this.status = SiteStatus.Rejected
  }

  getStatus(): SiteStatus {
    return this.status
  }

  static create(id: string, name: SiteName, description: Description, externalUrl: ExternalUrl, coordinates: Coordinates): SiteSubmission {
    return new SiteSubmission(id, name, description, externalUrl, coordinates, SiteStatus.PendingReview)
  }
}

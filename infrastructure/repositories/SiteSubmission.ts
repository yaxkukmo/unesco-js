import ISiteSubmissionRepository from '~/domain/ports/ISiteSubmissionRepository'
import SiteSubmission from '~/domain/site/entities/SiteSubmission'
import SiteName from '~/domain/site/value_objects/SiteName'
import Description from '~/domain/site/value_objects/Description'
import ExternalUrl from '~/domain/site/value_objects/ExternalUrl'
import Coordinates from '~/domain/site/value_objects/Coordinates'
import SiteStatus from '~/domain/site/enums/SiteStatus'


export class SiteSubmission extends BaseRepository implements ISiteSubmissionRepository {
    save(site: SiteSubmission): Promise<{ data: Site, status: boolean }> {
        const client = await this.getClient()
        const payload =  {
          id: site.id,
          name: site.name.getName(),
          description: site.description.getDescription(),
          lattitude: site.coordinates.getLatitude(),
          longitude: site.coordinates.getLongitude(),
          status: site.getStatus()
        }
        return client(`/api/submissions`, { method: 'POST', body: payload })
    }

}

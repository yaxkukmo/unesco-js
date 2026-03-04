export interface ISiteSubmission {
  save(id: string, name: SiteName, description: Description, externalUrl: ExternalUrl, coordinates: Coordinates, status: SiteStatus): Promise<{ data: Site, status: boolean }>
}

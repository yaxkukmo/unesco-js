export class ExternalUrl {
  private readonly externalUrl: string

  private constructor(externalUrl: string) {
    this.externalUrl = externalUrl
  }

  static create(externalUrl: string): ExternalUrl {
    if (this.isEmpty(externalUrl)) throw new Error('URL must be not empty')
    if (!this.isUrlFormat(externalUrl)) throw new Error('URL must be in standard format')

    return new ExternalUrl(externalUrl)
  }

  getExternalUrl(): string {
    return this.externalUrl
  }

  private static isEmpty(externalUrl: string): boolean {
    return externalUrl.trim().length === 0
  }

  private static isUrlFormat(externalUrl: string): boolean {
    try {
      const parsed = new URL(externalUrl)
      return parsed.protocol.startsWith('http')
    } catch {
      return false
    }
  }
}

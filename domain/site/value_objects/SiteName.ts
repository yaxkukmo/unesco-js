export class SiteName {
  private readonly name

  private constructor(name: string) {
    this.name = name
  }

  static create(name: string): SiteName {
    if (name.trim().length === 0) throw new Error('Name cannot be empty')
    return new SiteName(name)
  }

  getName(): string {
    return this.name
  }
}

export class Description {
  private readonly description

  private constructor(description: string) {
    this.description = description
  }

  static create(description: string): Description {
    if (description.trim().length === 0) throw new Error('Description cannot be empty')
    return new Description(description)
  }

  getDescription(): string {
    return this.description
  }
}

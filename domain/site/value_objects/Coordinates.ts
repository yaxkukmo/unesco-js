export class Coordinates {
  private readonly latitude: number
  private readonly longitude: number

  private constructor(latitude: number, longitude: number) {
    this.latitude = latitude
    this.longitude = longitude
  }

  static create(latitude: number, longitude: number): Coordinates {
    if (!this.isLatitudeInRange(latitude)) throw new Error('Invalid latitude')
    if (!this.isLongitudeInRange(longitude)) throw new Error('Invalid longitude')
    return new Coordinates(latitude, longitude)
  }

  getLatitude(): number {
    return this.latitude
  }

  getLongitude(): number {
    return this.longitude
  }

  private static isLatitudeInRange(latitude: number): boolean {
    return latitude >= -90 && latitude <= 90
  }

  private static isLongitudeInRange(longitude: number): boolean {
    return longitude >= -180 && longitude <= 180
  }
}

import { describe, it, expect } from 'vitest'
import { Coordinates } from '~/domain/site/value_objects/Coordinates'

describe('Coordinates', () => {
  it('should create valid coordinates', () => {
    const coords = Coordinates.create(52.2297, 21.0122)
    expect(coords.getLatitude()).toBe(52.2297)
    expect(coords.getLongitude()).toBe(21.0122)
  })

  it('should accept boundary values', () => {
    const coords = Coordinates.create(90, 180)
    expect(coords.getLatitude()).toBe(90)
    expect(coords.getLongitude()).toBe(180)

    const coords2 = Coordinates.create(-90, -180)
    expect(coords2.getLatitude()).toBe(-90)
    expect(coords2.getLongitude()).toBe(-180)
  })

  it('should reject latitude > 90', () => {
    expect(() => Coordinates.create(91, 0)).toThrow('Invalid latitude')
  })

  it('should reject latitude < -90', () => {
    expect(() => Coordinates.create(-91, 0)).toThrow('Invalid latitude')
  })

  it('should reject longitude > 180', () => {
    expect(() => Coordinates.create(0, 181)).toThrow('Invalid longitude')
  })

  it('should reject longitude < -180', () => {
    expect(() => Coordinates.create(0, -181)).toThrow('Invalid longitude')
  })
})

import { describe, it, expect } from 'vitest'
import { Description } from '~/domain/site/value_objects/Description'

describe('Description', () => {
  it('should create valid description', () => {
    const desc = Description.create('A historic castle in Krakow')
    expect(desc.getDescription()).toBe('A historic castle in Krakow')
  })

  it('should reject empty description', () => {
    expect(() => Description.create('')).toThrow('Description cannot be empty')
  })

  it('should reject whitespace-only description', () => {
    expect(() => Description.create('   ')).toThrow('Description cannot be empty')
  })
})

import { describe, it, expect } from 'vitest'
import { SiteName } from '~/domain/site/value_objects/SiteName'

describe('SiteName', () => {
  it('should create valid name', () => {
    const name = SiteName.create('Wawel Castle')
    expect(name.getName()).toBe('Wawel Castle')
  })

  it('should reject empty name', () => {
    expect(() => SiteName.create('')).toThrow('Name cannot be empty')
  })

  it('should reject whitespace-only name', () => {
    expect(() => SiteName.create('   ')).toThrow('Name cannot be empty')
  })
})

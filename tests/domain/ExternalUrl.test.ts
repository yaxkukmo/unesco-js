import { describe, it, expect } from 'vitest'
import { ExternalUrl } from '~/domain/site/value_objects/ExternalUrl'

describe('ExternalUrl', () => {
  it('should create valid http URL', () => {
    const url = ExternalUrl.create('http://example.com')
    expect(url.getExternalUrl()).toBe('http://example.com')
  })

  it('should create valid https URL', () => {
    const url = ExternalUrl.create('https://en.wikipedia.org/wiki/Wawel')
    expect(url.getExternalUrl()).toBe('https://en.wikipedia.org/wiki/Wawel')
  })

  it('should reject empty URL', () => {
    expect(() => ExternalUrl.create('')).toThrow('URL must be not empty')
  })

  it('should reject invalid URL format', () => {
    expect(() => ExternalUrl.create('not-a-url')).toThrow('URL must be in standard format')
  })

  it('should reject non-http protocol', () => {
    expect(() => ExternalUrl.create('ftp://example.com')).toThrow('URL must be in standard format')
  })
})

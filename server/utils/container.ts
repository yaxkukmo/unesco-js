import { SiteRepository } from '../../infrastructure/repositories/SiteRepository'
import { CountryRepository } from '../../infrastructure/repositories/CountryRepository'
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository'
import { SiteService } from '../services/SiteService'
import { CountryService } from '../services/CountryService'
import { CategoryService } from '../services/CategoryService'

const names = {
  siteRepository: 'SiteRepository',
  countryRepository: 'CountryRepository',
  categoryRepository: 'CategoryRepository',
  siteService: 'SiteService',
  countryService: 'CountryService',
  categoryService: 'CategoryService',
}

class Container {
  private instances = new Map<string, any>()

  getSiteRepository() {
    if (!this.instances.has(names.siteRepository)) {
      this.instances.set(names.siteRepository, new SiteRepository())
    }
    return this.instances.get(names.siteRepository)
  }

  getCountryRepository() {
    if (!this.instances.has(names.countryRepository)) {
      this.instances.set(names.countryRepository, new CountryRepository())
    }
    return this.instances.get(names.countryRepository)
  }

  getCategoryRepository() {
    if (!this.instances.has(names.categoryRepository)) {
      this.instances.set(names.categoryRepository, new CategoryRepository())
    }
    return this.instances.get(names.categoryRepository)
  }

  getSiteService() {
    if (!this.instances.has(names.siteService)) {
      const repository = this.getSiteRepository()
      this.instances.set(names.siteService, new SiteService(repository))
    }
    return this.instances.get(names.siteService)
  }

  getCountryService() {
    if (!this.instances.has(names.countryService)) {
      const repository = this.getCountryRepository()
      this.instances.set(names.countryService, new CountryService(repository))
    }
    return this.instances.get(names.countryService)
  }

  getCategoryService() {
    if (!this.instances.has(names.categoryService)) {
      const repository = this.getCategoryRepository()
      this.instances.set(names.categoryService, new CategoryService(repository))
    }
    return this.instances.get(names.categoryService)
  }

  reset() {
    this.instances.clear()
  }
}

export const container = new Container()

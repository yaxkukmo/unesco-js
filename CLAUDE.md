# UNESCO-JS - Architektura Projektu z Dependency Injection

## Instalacja

```bash
npm install tsyringe reflect-metadata
```

## Struktura Katalogów

```
unesco-js/
├── app/
│   ├── models/              # TypeScript interfaces/types
│   │   ├── Site.ts
│   │   ├── Country.ts
│   │   └── Category.ts
│   ├── pages/               # Vue pages (routing)
│   │   ├── sites/
│   │   │   ├── index.vue    # Lista sites
│   │   │   └── [id].vue     # Szczegóły site
│   │   ├── countries/
│   │   │   ├── index.vue
│   │   │   └── [id].vue
│   │   └── categories/
│   │       ├── index.vue
│   │       └── [id].vue
│   ├── composables/         # Reusable Vue composition functions
│   └── app.vue              # Root component
│
├── server/
│   ├── api/                 # Server endpoints (proxy do PHP API)
│   │   ├── sites.get.ts
│   │   ├── sites/
│   │   │   └── [id].get.ts
│   │   ├── countries.get.ts
│   │   ├── countries/
│   │   │   └── [id].get.ts
│   │   ├── categories.get.ts
│   │   └── categories/
│   │       └── [id].get.ts
│   ├── repositories/        # HTTP calls do PHP API
│   │   ├── interfaces/
│   │   │   ├── ISiteRepository.ts
│   │   │   ├── ICountryRepository.ts
│   │   │   └── ICategoryRepository.ts
│   │   ├── BaseRepository.ts
│   │   ├── SiteRepository.ts
│   │   ├── CountryRepository.ts
│   │   └── CategoryRepository.ts
│   ├── services/            # Business logic layer
│   │   ├── SiteService.ts
│   │   ├── CountryService.ts
│   │   └── CategoryService.ts
│   └── utils/
│       ├── apiUtils.ts      # JWT authentication & HTTP client
│       └── container.ts     # DI Container configuration
│
├── tsconfig.json
├── nuxt.config.ts           # Nuxt configuration
└── package.json
```

---

## Konfiguracja TypeScript

**tsconfig.json** - WAŻNE! Dodaj:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## Warstwy Architektury z DI

### 1. Models (app/models/)

**Odpowiedzialność:** Definicje typów TypeScript dla danych z API

**Country.ts:**
```typescript
export interface Country {
  id: number
  name: string
  code?: string
}
```

**Category.ts:**
```typescript
export interface Category {
  id: number
  name: string
  description?: string
}
```

**Site.ts:**
```typescript
import type { Country } from './Country'
import type { Category } from './Category'

export interface Site {
  id: number
  name: string
  description?: string
  country: Country
  categories: Category[]
  unesco_sites?: any[]
}
```

---

### 2. Repository Interfaces (server/repositories/interfaces/)

**Odpowiedzialność:** Definicje kontraktów dla repositories

**ISiteRepository.ts:**
```typescript
import type { Site } from '~/app/models/Site'

export interface ISiteRepository {
  findAll(filters?: {
    country?: string
    category?: string
    page?: number
    perPage?: number
  }): Promise<{ data: Site[], total: number }>

  findById(id: number): Promise<Site>
}
```

**ICountryRepository.ts:**
```typescript
import type { Country } from '~/app/models/Country'

export interface ICountryRepository {
  findAll(): Promise<Country[]>
  findById(id: number): Promise<Country>
}
```

**ICategoryRepository.ts:**
```typescript
import type { Category } from '~/app/models/Category'

export interface ICategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: number): Promise<Category>
}
```

---

### 3. Repositories (server/repositories/)

**Odpowiedzialność:**
- HTTP calls do PHP API (localhost:8080)
- Mapowanie URL i parametrów
- Obsługa błędów HTTP
- Implementacja interfaces

**BaseRepository.ts:**
```typescript
import { apiClient } from '../utils/apiUtils'

export class BaseRepository {
  protected apiClient: any

  protected async getClient() {
    if (!this.apiClient) {
      this.apiClient = await apiClient()
    }
    return this.apiClient
  }
}
```

**SiteRepository.ts:**
```typescript
import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { BaseRepository } from './BaseRepository'
import type { ISiteRepository } from './interfaces/ISiteRepository'
import type { Site } from '~/app/models/Site'

@injectable()
export class SiteRepository extends BaseRepository implements ISiteRepository {
  private endpoint = '/api/sites'

  async findAll(filters?: {
    country?: string
    category?: string
    page?: number
    perPage?: number
  }): Promise<{ data: Site[], total: number }> {
    const client = await this.getClient()
    const params = new URLSearchParams(filters as any).toString()
    const url = params ? `${this.endpoint}?${params}` : this.endpoint
    return client(url)
  }

  async findById(id: number): Promise<Site> {
    const client = await this.getClient()
    return client(`${this.endpoint}/${id}`)
  }
}
```

**CountryRepository.ts:**
```typescript
import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { BaseRepository } from './BaseRepository'
import type { ICountryRepository } from './interfaces/ICountryRepository'
import type { Country } from '~/app/models/Country'

@injectable()
export class CountryRepository extends BaseRepository implements ICountryRepository {
  private endpoint = '/api/countries'

  async findAll(): Promise<Country[]> {
    const client = await this.getClient()
    return client(this.endpoint)
  }

  async findById(id: number): Promise<Country> {
    const client = await this.getClient()
    return client(`${this.endpoint}/${id}`)
  }
}
```

**CategoryRepository.ts:**
```typescript
import 'reflect-metadata'
import { injectable } from 'tsyringe'
import { BaseRepository } from './BaseRepository'
import type { ICategoryRepository } from './interfaces/ICategoryRepository'
import type { Category } from '~/app/models/Category'

@injectable()
export class CategoryRepository extends BaseRepository implements ICategoryRepository {
  private endpoint = '/api/categories'

  async findAll(): Promise<Category[]> {
    const client = await this.getClient()
    return client(this.endpoint)
  }

  async findById(id: number): Promise<Category> {
    const client = await this.getClient()
    return client(`${this.endpoint}/${id}`)
  }
}
```

---

### 4. Services (server/services/)

**Odpowiedzialność:**
- Logika biznesowa
- Transformacje danych
- Walidacje
- Łączenie danych z wielu źródeł
- Cache (opcjonalnie)
- **Używa DI do otrzymania repositories**

**SiteService.ts:**
```typescript
import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import type { ISiteRepository } from '../repositories/interfaces/ISiteRepository'
import type { Site } from '~/app/models/Site'

@injectable()
export class SiteService {
  constructor(
    @inject('ISiteRepository') private repository: ISiteRepository
  ) {}

  async listSites(filters?: {
    country?: string
    category?: string
    page?: number
    perPage?: number
  }): Promise<{ data: Site[], total: number }> {
    // Walidacja parametrów
    if (filters?.page && filters.page < 1) {
      throw new Error('Page must be >= 1')
    }

    // Wywołanie repository
    const result = await this.repository.findAll(filters)

    // Tutaj możesz dodać:
    // - transformacje danych
    // - cache
    // - dodatkową logikę biznesową

    return {
      data: result.data,
      total: result.total
    }
  }

  async getSiteDetails(id: number): Promise<Site> {
    // Walidacja
    if (!id || id <= 0) {
      throw new Error('Invalid site ID')
    }

    return this.repository.findById(id)
  }
}
```

**CountryService.ts:**
```typescript
import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import type { ICountryRepository } from '../repositories/interfaces/ICountryRepository'
import type { Country } from '~/app/models/Country'

@injectable()
export class CountryService {
  constructor(
    @inject('ICountryRepository') private repository: ICountryRepository
  ) {}

  async listCountries(): Promise<Country[]> {
    return this.repository.findAll()
  }

  async getCountryDetails(id: number): Promise<Country> {
    if (!id || id <= 0) {
      throw new Error('Invalid country ID')
    }
    return this.repository.findById(id)
  }
}
```

**CategoryService.ts:**
```typescript
import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import type { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository'
import type { Category } from '~/app/models/Category'

@injectable()
export class CategoryService {
  constructor(
    @inject('ICategoryRepository') private repository: ICategoryRepository
  ) {}

  async listCategories(): Promise<Category[]> {
    return this.repository.findAll()
  }

  async getCategoryDetails(id: number): Promise<Category> {
    if (!id || id <= 0) {
      throw new Error('Invalid category ID')
    }
    return this.repository.findById(id)
  }
}
```

---

### 5. DI Container Configuration (server/utils/container.ts)

**Odpowiedzialność:** Konfiguracja i rejestracja wszystkich zależności

```typescript
import 'reflect-metadata'
import { container } from 'tsyringe'
import { SiteRepository } from '../repositories/SiteRepository'
import { CountryRepository } from '../repositories/CountryRepository'
import { CategoryRepository } from '../repositories/CategoryRepository'

// Rejestracja repositories z tokenami interfejsów
container.register('ISiteRepository', {
  useClass: SiteRepository
})

container.register('ICountryRepository', {
  useClass: CountryRepository
})

container.register('ICategoryRepository', {
  useClass: CategoryRepository
})

// Eksport skonfigurowanego containera
export { container }
```

---

### 6. API Endpoints (server/api/)

**Odpowiedzialność:**
- Obsługa HTTP requests z frontendu
- Wywoływanie serwisów przez DI Container
- Zwracanie odpowiedzi

**server/api/sites.get.ts:**
```typescript
import 'reflect-metadata'
import { container } from '../utils/container'
import { SiteService } from '../services/SiteService'

export default defineEventHandler(async (event) => {
  // DI Container automatycznie rozwiązuje wszystkie zależności
  const service = container.resolve(SiteService)
  const query = getQuery(event)

  return service.listSites({
    country: query.country as string,
    category: query.category as string,
    page: query.page ? Number(query.page) : 1,
    perPage: query.perPage ? Number(query.perPage) : 10
  })
})
```

**server/api/sites/[id].get.ts:**
```typescript
import 'reflect-metadata'
import { container } from '../../utils/container'
import { SiteService } from '../../services/SiteService'

export default defineEventHandler(async (event) => {
  const service = container.resolve(SiteService)
  const id = Number(event.context.params?.id)

  return service.getSiteDetails(id)
})
```

**server/api/countries.get.ts:**
```typescript
import 'reflect-metadata'
import { container } from '../utils/container'
import { CountryService } from '../services/CountryService'

export default defineEventHandler(async () => {
  const service = container.resolve(CountryService)
  return service.listCountries()
})
```

**server/api/countries/[id].get.ts:**
```typescript
import 'reflect-metadata'
import { container } from '../../utils/container'
import { CountryService } from '../../services/CountryService'

export default defineEventHandler(async (event) => {
  const service = container.resolve(CountryService)
  const id = Number(event.context.params?.id)

  return service.getCountryDetails(id)
})
```

**server/api/categories.get.ts:**
```typescript
import 'reflect-metadata'
import { container } from '../utils/container'
import { CategoryService } from '../services/CategoryService'

export default defineEventHandler(async () => {
  const service = container.resolve(CategoryService)
  return service.listCategories()
})
```

**server/api/categories/[id].get.ts:**
```typescript
import 'reflect-metadata'
import { container } from '../../utils/container'
import { CategoryService } from '../../services/CategoryService'

export default defineEventHandler(async (event) => {
  const service = container.resolve(CategoryService)
  const id = Number(event.context.params?.id)

  return service.getCategoryDetails(id)
})
```

---

### 7. Vue Pages (app/pages/)

**Odpowiedzialność:**
- UI/UX
- Wywołanie server endpoints przez $fetch
- Renderowanie danych

**app/pages/sites/index.vue:**
```vue
<script setup lang="ts">
import type { Site } from '~/app/models/Site'

const { data: result } = await useAsyncData('sites', () =>
  $fetch<{ data: Site[], total: number }>('/api/sites')
)
</script>

<template>
  <div>
    <h1>UNESCO Sites</h1>
    <p>Total: {{ result?.total }}</p>
    <ul>
      <li v-for="site in result?.data" :key="site.id">
        <NuxtLink :to="`/sites/${site.id}`">
          {{ site.name }} - {{ site.country.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
```

**app/pages/sites/[id].vue:**
```vue
<script setup lang="ts">
import type { Site } from '~/app/models/Site'

const route = useRoute()
const id = route.params.id

const { data: site } = await useAsyncData(`site-${id}`, () =>
  $fetch<Site>(`/api/sites/${id}`)
)
</script>

<template>
  <div v-if="site">
    <h1>{{ site.name }}</h1>
    <p>Country: {{ site.country.name }}</p>
    <p>{{ site.description }}</p>
    <h2>Categories:</h2>
    <ul>
      <li v-for="category in site.categories" :key="category.id">
        {{ category.name }}
      </li>
    </ul>
  </div>
</template>
```

**app/pages/countries/index.vue:**
```vue
<script setup lang="ts">
import type { Country } from '~/app/models/Country'

const { data: countries } = await useAsyncData('countries', () =>
  $fetch<Country[]>('/api/countries')
)
</script>

<template>
  <div>
    <h1>Countries</h1>
    <ul>
      <li v-for="country in countries" :key="country.id">
        <NuxtLink :to="`/countries/${country.id}`">
          {{ country.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
```

**app/pages/categories/index.vue:**
```vue
<script setup lang="ts">
import type { Category } from '~/app/models/Category'

const { data: categories } = await useAsyncData('categories', () =>
  $fetch<Category[]>('/api/categories')
)
</script>

<template>
  <div>
    <h1>Categories</h1>
    <ul>
      <li v-for="category in categories" :key="category.id">
        <NuxtLink :to="`/categories/${category.id}`">
          {{ category.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
```

---

## Zalety Dependency Injection Container

### ✅ Loose Coupling
```typescript
// Service zależy od INTERFACE, nie konkretnej implementacji
constructor(@inject('ISiteRepository') private repository: ISiteRepository)
```

### ✅ Łatwe Testowanie
```typescript
// W testach możesz podmienić implementację
container.register('ISiteRepository', {
  useClass: MockSiteRepository  // Test double
})

const service = container.resolve(SiteService)
// Service używa mocka zamiast prawdziwego repository
```

### ✅ Single Responsibility
- Repository: tylko HTTP calls
- Service: tylko logika biznesowa
- Endpoint: tylko obsługa HTTP request/response

### ✅ Automatyczne Rozwiązywanie Zależności
```typescript
// Container sam tworzy cały graf zależności:
// SiteService → ISiteRepository → SiteRepository → BaseRepository
const service = container.resolve(SiteService)
```

### ✅ Łatwa Podmiana Implementacji
```typescript
// Chcesz cache? Stwórz CachedSiteRepository
container.register('ISiteRepository', {
  useClass: CachedSiteRepository  // Implementuje ISiteRepository
})
// Cała reszta kodu działa bez zmian!
```

---

## Konwencje Nazewnictwa

### Pliki:
- Models: `PascalCase.ts` (Site.ts, Country.ts)
- Interfaces: `IPascalCase.ts` (ISiteRepository.ts)
- Repositories: `PascalCaseRepository.ts` (SiteRepository.ts)
- Services: `PascalCaseService.ts` (SiteService.ts)
- API endpoints: `lowercase.get.ts` (sites.get.ts)
- Pages: `lowercase/[param].vue` (sites/[id].vue)

### Klasy i interfejsy:
- Interfaces: `IPascalCase` (ISiteRepository, ICountryRepository)
- Classes: `PascalCase` (SiteService, SiteRepository)
- Methods: `camelCase` (findAll, getSiteDetails)

### DI Tokens:
- Używaj nazwy interfejsu jako token: `'ISiteRepository'`
- Zachowaj spójność w całym projekcie

### Metody w Repository:
- `findAll()` - lista wszystkich
- `findById(id)` - pojedynczy element
- `count()` - liczba elementów (jeśli potrzebne)

### Metody w Service:
- `list{Entity}()` - lista (np. listSites)
- `get{Entity}Details(id)` - szczegóły (np. getSiteDetails)

---

## Flow Danych z DI

```
Browser Request
    ↓
Vue Page (useAsyncData + $fetch)
    ↓
Server API Endpoint (/api/sites)
    ↓
DI Container.resolve(SiteService)
    ├─→ Tworzy SiteService
    └─→ Wstrzykuje ISiteRepository (SiteRepository)
    ↓
Service Layer (SiteService.listSites())
    ↓
Repository Layer (SiteRepository.findAll())
    ↓
apiClient (JWT auth + HTTP)
    ↓
PHP API (localhost:8080/api/sites)
    ↓
Response z PHP
    ↓
Repository zwraca dane
    ↓
Service przetwarza (opcjonalnie)
    ↓
API Endpoint zwraca JSON
    ↓
Vue Page renderuje
```

---

## Konfiguracja

### package.json - dodaj dependencies:
```json
{
  "dependencies": {
    "tsyringe": "^4.8.0",
    "reflect-metadata": "^0.2.1"
  }
}
```

### tsconfig.json:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strict": true,
    "moduleResolution": "node",
    "target": "ES2020"
  }
}
```

### nuxt.config.ts:
```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // Server-only (nie dostępne w browser)
    apiBase: 'http://localhost:8080',
    apiClientId: 'maalob@gmail.com',
    apiClientSecret: 'MojeSuperHaslo2024',
  }
})
```

### server/utils/apiUtils.ts:
```typescript
let token: string | null = null;
let expiresAt = 0;

export const apiClient = async () => {
  const config = useRuntimeConfig()

  if (!token || Date.now() > expiresAt) {
    const auth = await $fetch(`${config.apiBase}/api/auth/login`, {
      method: 'POST',
      body: {
        email: config.apiClientId,
        password: config.apiClientSecret
      }
    })
    token = String(auth.access_token)
    expiresAt = Date.now() + (Number(auth.expires_in) * 1000)
  }

  return async (url: string, options = {}) => {
    return $fetch(url, {
      ...options,
      baseURL: config.apiBase,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
      }
    })
  }
}
```

---

## Kolejność Implementacji

1. **Instalacja** - `npm install tsyringe reflect-metadata`
2. **Konfiguracja TypeScript** - dodaj decorators do tsconfig.json
3. **Models** - zdefiniuj wszystkie interfejsy (Site, Country, Category)
4. **Repository Interfaces** - stwórz kontrakty (ISiteRepository, etc.)
5. **BaseRepository** - stwórz bazową klasę
6. **Repositories** - implementuj z @injectable decorator
7. **Services** - dodaj logikę biznesową z @inject
8. **DI Container** - skonfiguruj container.ts i zarejestruj wszystkie zależności
9. **API Endpoints** - użyj container.resolve()
10. **Pages** - zbuduj UI

---

## Testowanie

### Test Repository:
```bash
# W przeglądarce/curl
curl http://localhost:3000/api/sites
curl http://localhost:3000/api/sites/1
curl http://localhost:3000/api/countries
curl http://localhost:3000/api/categories
```

### Test Page:
```bash
# Otwórz w przeglądarce
http://localhost:3000/sites
http://localhost:3000/sites/1
http://localhost:3000/countries
http://localhost:3000/categories
```

### Unit Testing z DI:
```typescript
import { container } from 'tsyringe'
import { SiteService } from './SiteService'
import { MockSiteRepository } from './mocks/MockSiteRepository'

describe('SiteService', () => {
  beforeEach(() => {
    // Podmień repository na mock
    container.register('ISiteRepository', {
      useClass: MockSiteRepository
    })
  })

  it('should list sites', async () => {
    const service = container.resolve(SiteService)
    const result = await service.listSites()

    expect(result.data).toBeDefined()
    expect(result.total).toBeGreaterThan(0)
  })
})
```

---

## Rozszerzenia (TODO)

- [ ] Error handling (try/catch w repositories/services)
- [ ] Loading states w pages
- [ ] Cache layer (CachedSiteRepository implementujący ISiteRepository)
- [ ] Paginacja (component + logika)
- [ ] Filtry (formularz w pages)
- [ ] Composables dla wspólnej logiki (useFilters, usePagination)
- [ ] Unit testy z mockowanymi dependencies (Vitest + tsyringe)
- [ ] Logging/monitoring (LoggingDecorator dla repositories)
- [ ] Retry logic (RetryRepository wrapper)

---

## Przykład Cache Layer z DI

```typescript
// CachedSiteRepository.ts
@injectable()
export class CachedSiteRepository implements ISiteRepository {
  private cache = new Map()

  constructor(
    @inject('ISiteRepository') private baseRepository: ISiteRepository
  ) {}

  async findAll(filters?: any) {
    const key = JSON.stringify(filters)

    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    const result = await this.baseRepository.findAll(filters)
    this.cache.set(key, result)
    return result
  }

  async findById(id: number) {
    if (this.cache.has(id)) {
      return this.cache.get(id)
    }

    const result = await this.baseRepository.findById(id)
    this.cache.set(id, result)
    return result
  }
}

// W container.ts zmień rejestrację:
container.register('ISiteRepository', {
  useClass: CachedSiteRepository  // Teraz wszyscy używają cache!
})
```

Cała reszta kodu działa bez zmian! To jest siła Dependency Injection.

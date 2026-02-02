<script setup lang="ts">
import SiteComponent from '../../components/Site.vue'
import ClusteredMap from '../../components/ClusteredMap.vue'
import type { Site } from '~/app/models/Site'
import type { Country } from '~/app/models/Country'
import type { SiteResponse } from '~/app/dto/SiteResponse'

const selectedCountryId = ref<number | null>(26)
const page = ref<number>(1)
const sites = ref<Site[]>([])
const total = ref<number>(0)
const lastPage = ref<number>(0)

const load = async (reset = false) => {
  if (reset) {
    sites.value = []
    page.value = 1
  }

  if (page > lastPage) return

  const result = await $fetch<SiteResponse>('/api/sites', {
    query: {
      country: selectedCountryId.value,
      page: page.value
    }
  })
  sites.value.push(...result.data)
  total.value = result.total
  lastPage.value = result.lastPage
  page.value++
}
watch(selectedCountryId, () => load(true))
await load()
useInfiniteScroll('footer', load)

</script>

<template>
  <div class="page-container">
    <section class="filters-section">
      <div class="filter-group">
        <label for="country-filter">Filter by country</label>
        <CountryDropdown v-model="selectedCountryId" id="country-filter" />
      </div>
      <div class="results-count">
        <span class="count">{{ total }}</span> sites found
      </div>
    </section>

    <section class="map-section">
      <ClientOnly>
        <ClusteredMap :sites="sites" />
        <template #fallback>
          <div class="map-placeholder">Loading map...</div>
        </template>
      </ClientOnly>
    </section>

    <section class="sites-section">
      <h2 class="section-title">All Sites</h2>
      <div v-if="sites" class="sites-list">
        <SiteComponent v-for="site in sites" :key="site.id" :site="site" />
      </div>
      <div v-else class="loading">
        <div class="spinner"></div>
        <p>Loading sites...</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #555;
}

.filter-group select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  min-width: 250px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-group select:hover {
  border-color: #1976d2;
}

.filter-group select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.results-count {
  font-size: 1rem;
  color: #666;
}

.results-count .count {
  font-weight: 700;
  font-size: 1.5rem;
  color: #1976d2;
}

.map-section {
  margin-bottom: 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.map-placeholder {
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  color: #666;
  font-size: 1.1rem;
}

.sites-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin: 0 0 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #1976d2;
  display: inline-block;
}

.sites-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group select {
    min-width: 100%;
  }

  .sites-list {
    grid-template-columns: 1fr;
  }
}
</style>

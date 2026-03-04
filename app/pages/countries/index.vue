<script setup lang="ts">
import type { Country } from '~/shared/types/Country'

const { data: countries } = await useAsyncData(
    'countries',
    () => $fetch<Country[]>('/api/countries')
)
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1>Countries</h1>
      <p class="subtitle">Browse UNESCO sites by country</p>
    </header>

    <div class="countries-grid">
      <NuxtLink
        v-for="country in countries"
        :key="country.id"
        :to="{ name: 'countries-id', params: { id: country.id } }"
        class="country-card"
      >
        {{ country.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin: 0 0 0.5rem;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.countries-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.country-card {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.9rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  text-decoration: none;
  color: #1a1a2e;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}

.country-card:hover {
  background: #1976d2;
  border-color: #1976d2;
  color: white;
}

@media (max-width: 600px) {
  .page-container {
    padding: 1rem;
  }
}
</style>

<script setup lang="ts">
import type { Site } from '~/shared/types/Site'

const route = useRoute()
const siteId = computed(() => `site-${route.params.id}`)

const { data: site } = await useAsyncData(siteId, () =>
  $fetch<Site>(`/api/sites/${route.params.id}`)
)
</script>

<template>
  <div class="site-details" v-if="site">
    <NuxtLink to="/sites" class="back-link">
      <span class="back-arrow">&larr;</span> Back to all sites
    </NuxtLink>

    <article class="site-content">
      <header class="site-header">
        <div class="hero-image" v-if="site.image_url">
          <img :src="site.image_url" :alt="site.name" />
          <div class="hero-overlay">
            <span class="country-badge">{{ site.country.name }}</span>
          </div>
        </div>

        <div class="header-content">
          <h1>{{ site.name }}</h1>
          <div class="categories" v-if="site.categories?.length">
            <span
              v-for="category in site.categories"
              :key="category.id"
              class="category-tag"
            >
              {{ category.name }}
            </span>
          </div>
        </div>
      </header>

      <div class="content-grid">
        <section class="main-content">
          <div class="description-section">
            <h2>About this site</h2>
            <p class="description">{{ site.description }}</p>
          </div>

          <div class="map-section">
            <h2>Location</h2>
            <ClientOnly>
              <Map
                :latitude="site.latitude"
                :longitude="site.longitude"
                :name="site.name"
                :zoom="6"
              />
              <template #fallback>
                <div class="map-placeholder">Loading map...</div>
              </template>
            </ClientOnly>
            <p class="coordinates">
              {{ site.latitude.toFixed(6) }}° N, {{ site.longitude.toFixed(6) }}° E
            </p>
          </div>
        </section>

        <aside class="sidebar">
          <div class="info-card">
            <h3>Quick Facts</h3>
            <dl class="facts-list">
              <div class="fact-item">
                <dt>Country</dt>
                <dd>{{ site.country.name }}</dd>
              </div>
              <div class="fact-item" v-if="site.year_inscribed">
                <dt>Year Inscribed</dt>
                <dd>{{ site.year_inscribed }}</dd>
              </div>
              <div class="fact-item">
                <dt>Coordinates</dt>
                <dd>{{ site.latitude.toFixed(4) }}, {{ site.longitude.toFixed(4) }}</dd>
              </div>
            </dl>
          </div>

          <div class="links-card" v-if="site.wikipedia_url">
            <h3>External Links</h3>
            <a :href="site.wikipedia_url" target="_blank" rel="noopener" class="external-link">
              <span class="link-icon">W</span>
              Wikipedia
              <span class="external-arrow">&nearr;</span>
            </a>
          </div>
        </aside>
      </div>
    </article>
  </div>

  <div class="loading" v-else>
    <div class="spinner"></div>
    <p>Loading site details...</p>
  </div>
</template>

<style scoped>
.site-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
  transition: gap 0.2s;
}

.back-link:hover {
  gap: 0.75rem;
}

.back-arrow {
  font-size: 1.2rem;
}

.site-content {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.site-header {
  position: relative;
}

.hero-image {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

.country-badge {
  background: rgba(255, 255, 255, 0.95);
  color: #1a1a2e;
  padding: 0.5rem 1rem;
  border-radius: 24px;
  font-weight: 600;
  font-size: 0.9rem;
}

.header-content {
  padding: 2rem;
}

.header-content h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin: 0 0 1rem;
  line-height: 1.3;
}

.categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  padding: 0 2rem 2rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.description-section h2,
.map-section h2 {
  font-size: 1.25rem;
  color: #1a1a2e;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.description {
  line-height: 1.8;
  color: #444;
  margin: 0;
  font-size: 1.05rem;
}

.map-section :deep(.map-container) {
  border-radius: 12px;
  overflow: hidden;
}

.map-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
  border-radius: 12px;
  color: #666;
}

.coordinates {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #888;
  font-family: monospace;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card,
.links-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-card h3,
.links-card h3 {
  font-size: 1rem;
  color: #1a1a2e;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.facts-list {
  margin: 0;
}

.fact-item {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.fact-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.fact-item dt {
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 0.25rem;
}

.fact-item dd {
  margin: 0;
  font-weight: 600;
  color: #1a1a2e;
}

.external-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: white;
  border-radius: 8px;
  text-decoration: none;
  color: #1a1a2e;
  font-weight: 500;
  transition: box-shadow 0.2s, transform 0.2s;
}

.external-link:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.link-icon {
  width: 28px;
  height: 28px;
  background: #1a1a2e;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.external-arrow {
  margin-left: auto;
  color: #888;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
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

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .info-card,
  .links-card {
    flex: 1;
    min-width: 250px;
  }
}

@media (max-width: 600px) {
  .site-details {
    padding: 1rem;
  }

  .hero-image {
    height: 250px;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .content-grid {
    padding: 0 1rem 1rem;
  }

  .sidebar {
    flex-direction: column;
  }
}
</style>

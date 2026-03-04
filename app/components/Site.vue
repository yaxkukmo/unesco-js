<script setup lang="ts">
import type { Site } from '~/shared/types/Site'

defineProps<{site: Site}>()
</script>

<template>
  <article class="site-card">
    <NuxtLink :to="`/sites/${site.id}`" class="card-link">
      <div class="image-wrapper">
        <img :src="site.image_url" :alt="site.name" />
        <div class="country-badge">{{ site.country.name }}</div>
      </div>
      <div class="card-content">
        <h2>{{ site.name }}</h2>
        <p v-if="site.description" class="description">
          {{ site.description.slice(0, 120) }}{{ site.description.length > 120 ? '...' : '' }}
        </p>
        <div class="categories" v-if="site.categories?.length">
          <span
            v-for="category in site.categories.slice(0, 2)"
            :key="category.id"
            class="category-tag"
          >
            {{ category.name }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<style scoped>
.site-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.site-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.site-card:hover .image-wrapper img {
  transform: scale(1.05);
}

.country-badge {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-content {
  padding: 1.25rem;
}

.card-content h2 {
  margin: 0 0 0.75rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.4;
}

.description {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}
</style>

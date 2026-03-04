<script setup lang="ts">
import type { Category } from '~/shared/types/Category'

const { data: categories } = await useAsyncData(
    'categories',
    () => $fetch<Category[]>('/api/categories')
)
</script>

<template>
  <div class="page-container">
    <header class="page-header">
      <h1>Categories</h1>
      <p class="subtitle">Browse UNESCO sites by category</p>
    </header>

    <div class="categories-grid">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="{ path: '/sites', query: { categoryid: category.id } }"
        class="category-card"
      >
        {{ category.name }}
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

.categories-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-card {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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

.category-card:hover {
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

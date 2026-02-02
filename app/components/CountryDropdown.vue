<script setup lang="ts">
const model = defineModel<number | null>()
const {countries, loading, fetch} = useCountries()
onMounted(() => fetch())
</script>

<template>
  <select v-model="model" :disabled="loading">
    <option :value="null">
      {{ loading ? 'Loading...' : 'Select country' }}
    </option>
    <option
      v-for="country in countries"
      :key="country.id"
      :value="country.id"
    >
      {{ country.name }}
    </option>
  </select>
</template>

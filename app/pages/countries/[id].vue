<script setup lang="ts">
const countryId = useRoute().params.id
const { data: country } = await useAsyncData(
    'country', 
    () => $fetch<Country>(`/api/countries/${countryId}`)
)
</script>

<template><div v-if="country"> {{ country.name }} has ID: {{ country.id }} </div></template>

export const useCountries = () => {
  const countries = useState<Country[]>('countries', () => [])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async () => {
    if (countries.value.length > 0) return  // cache

    loading.value = true
    try {
      countries.value = await $fetch('/api/countries')
    } catch (e) {
      error.value = 'Failed to load countries'
    } finally {
      loading.value = false
    }
  }

  return { countries, loading, error, fetch }
}

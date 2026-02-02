<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix dla ikon Leaflet w bundlerach
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

const props = defineProps<{
  latitude: number
  longitude: number
  name: string
  zoom?: number
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let marker: L.Marker | null = null

const initMap = () => {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView(
    [props.latitude, props.longitude],
    props.zoom || 13
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map)

  marker = L.marker([props.latitude, props.longitude]).addTo(map)
  marker.bindPopup(`<b>${props.name}</b>`).openPopup()
}

onMounted(() => {
  initMap()
})

watch(() => [props.latitude, props.longitude, props.name], () => {
  if (map && marker) {
    const newLatLng = L.latLng(props.latitude, props.longitude)
    map.setView(newLatLng, props.zoom || 13)
    marker.setLatLng(newLatLng)
    marker.bindPopup(`<b>${props.name}</b>`).openPopup()
  }
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}
</style>

 <script setup lang="ts">
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.markercluster'
  import 'leaflet.markercluster/dist/MarkerCluster.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import type { Site } from '~/shared/types/Site'

  // Fix dla ikon
  import icon from 'leaflet/dist/images/marker-icon.png'
  import iconShadow from 'leaflet/dist/images/marker-shadow.png'

  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  })
  L.Marker.prototype.options.icon = DefaultIcon

  const props = defineProps<{
    sites: Site[]
  }>()

  const addMarkers = (sites: Site[]) => {
    if (!markerClusterGroup) return

    sites.forEach(site => {
      if (site.latitude && site.longitude) {
        const marker = L.marker([site.latitude, site.longitude])
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px; font-size: 16px;">
                <a href="/sites/${site.id}" style="color: #1976d2; text-decoration: none;">
                  ${site.name}
                </a>
              </h3>
              <p style="margin: 0; color: #666; font-size: 14px;">
                ${site.country.name}
              </p>
            </div>
          `)
        markerClusterGroup.addLayer(marker)
      }
    })
  }

  watch(() => props.sites, (newSites) => {
   markerClusterGroup.clearLayers()
   addMarkers(newSites)
  }, { deep: true })

  const mapContainer = ref<HTMLElement | null>(null)
  let map: L.Map | null = null
  let markerClusterGroup: L.MarkerClusterGroup | null = null

  const initMap = () => {
    if (!mapContainer.value || !props.sites.length) return

    map = L.map(mapContainer.value).setView([20, 0], 2)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map)

    // Utwórz cluster group
    markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 80
    })

    addMarkers(props.sites)
    map.addLayer(markerClusterGroup)
  }

  onMounted(() => {
    initMap()
  })

  onBeforeUnmount(() => {
    if (map) {
      map.remove()
    }
  })
  </script>

  <template>
    <div ref="mapContainer" class="clustered-map-container"></div>
  </template>

  <style scoped>
  .clustered-map-container {
    height: 600px;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
  }
  </style>

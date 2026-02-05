export const useInfiniteScroll = (elementId: string, callback: () => void) => {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const element = document.querySelector(elementId)

    if (!element) return

    const isAppearingInViewport = (entries) => entries[0].isIntersecting

    const intersectionCallback = (entries, observer) => {
      if (isAppearingInViewport(entries)) {
        callback()
      }
    }

    observer = new IntersectionObserver(intersectionCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0
    })
    observer.observe(element)
  })

  onUnmounted(() => observer.disconnect())
}

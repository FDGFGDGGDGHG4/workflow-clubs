import { usePreferencesStore } from '~/stores/preferences'

export default defineNuxtPlugin(nuxtApp => {
  const preferences = usePreferencesStore()
  // Restore after hydration so server and first client render agree.
  nuxtApp.hook('app:mounted', () => {
    try {
      const saved = JSON.parse(localStorage.getItem('workflow:preferences') || 'null')
      if (saved) preferences.setDensity(saved.density)
    } catch { /* Storage can be unavailable or contain an older format. */ }
    preferences.$subscribe((_mutation, state) => {
      try { localStorage.setItem('workflow:preferences', JSON.stringify({ density: state.density })) } catch { /* Preferences still work for this session. */ }
    }, { detached: true })
    window.addEventListener('storage', event => {
      if (event.key !== 'workflow:preferences') return
      try { preferences.setDensity(JSON.parse(event.newValue || 'null')?.density) } catch { /* Ignore invalid external values. */ }
    })
  })
})

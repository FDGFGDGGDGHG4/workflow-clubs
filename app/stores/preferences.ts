import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({ density: 'comfortable' as 'comfortable' | 'compact' }),
  actions: {
    setDensity(value: string) {
      this.density = value === 'compact' ? 'compact' : 'comfortable'
    },
  },
})

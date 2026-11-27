// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  nitro: {
    storage: { workflow: { driver: 'fs', base: './.data/workflow' } },
    devStorage: { workflow: { driver: 'fs', base: './.data/workflow' } }
  }
})

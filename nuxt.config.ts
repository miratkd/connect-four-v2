// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ["~/assets/main.sass"],
  devtools: { enabled: true },
  devServer: {host: '192.168.0.183'},
})

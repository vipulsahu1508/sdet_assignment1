const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video:false,
  reporter: "../node_modules/mochawesome/src/mochawesome.js",
    reporterOptions: {
        overwrite: false,
        html: false,
        json: true
    },
  e2e: {
    baseUrl: 'http://automationpractice.com',
  }
})
module.exports = {
  // https://googlechromelabs.github.io/sw-toolbox/api.html
  debug: true,
  staticFileGlobs: [
    'manifest.json',
    "js/**/*",
    "image/**/*",
    "font/**/*"
  ],
  runtimeCaching: [
    // https://github.com/GoogleChromeLabs/sw-precache#runtimecaching-arrayobject
    // https://googlechromelabs.github.io/sw-toolbox/api.html#handlers
    {
      urlPattern: /\/@webcomponents\/webcomponentsjs\//,
      handler: 'fastest',
      options: {
        cache: {
          name: 'webcomponentsjs',
          maxEntries: 10,
        }
      }
    },
    {
      urlPattern: /^https:\/\/polyfill.io\//,
      handler: 'cacheFirst',
      options: {
        cache: {
          name: 'polyfill',
          maxEntries: 2,
        }
      }
    },
    {
      urlPattern: /^https:\/\/api.salav.at\//,
      handler: 'fastest',
      options: {
        cache: {
          name: 'api',
          maxEntries: 10,
        }
      }
    }
  ]
};

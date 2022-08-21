export default {
  swDest: 'build/sw.js',
  globPatterns: ['**/*.{html,woff2,png,svg,jpg,js}'],
  globDirectory: 'build/',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: new RegExp('^(.*).(png|jpg|svg)$'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'Images',
      },
    },
  ],
};

module.exports = {
  staticFileGlobs: [
    'manifest.json',
    'js/**/*',
  ],
  runtimeCaching: [
    {
      urlPattern: /\/@webcomponents\/webcomponentsjs\//,
      handler: 'fastest'
    }
  ]
};

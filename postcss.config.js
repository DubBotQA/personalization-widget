module.exports = {
  plugins: [
    // Enable modern CSS features
    require('postcss-preset-env')({
      stage: 1, // Use stage 1 features (stable)
      features: {
        'custom-properties': false, // We'll handle this separately for better control
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
        'logical-properties-and-values': true,
        'dir-pseudo-class': true,
        'focus-within-pseudo-class': true,
        'focus-visible-pseudo-class': true
      },
      browsers: ['> 0.5%', 'last 2 versions', 'not dead']
    }),
    
    // Enable CSS nesting
    require('postcss-nested'),
    
    // Handle custom properties with fallbacks
    require('postcss-custom-properties')({
      preserve: true, // Keep custom properties for browsers that support them
      fallback: true  // Add fallbacks for older browsers
    }),
    
    // Prefix all styles with a widget-specific class to avoid conflicts
    // But exclude :host selectors which are for Shadow DOM
    require('postcss-prefixwrap')('.dubbot-personalization-widget', {
      ignoredSelectors: [':host']
    }),
    
    // Add vendor prefixes
    require('autoprefixer'),
    
    // Minify in production
    ...(process.env.NODE_ENV === 'production' ? [
      require('cssnano')({
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyParams: true
        }]
      })
    ] : [])
  ]
};

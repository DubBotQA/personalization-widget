export default {
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'DubbotPersonalizationWidget',
      fileName: () => 'db-personalization-widget.bundle.js',
      formats: ['iife']
    },
    rollupOptions: {
      // Ensure CSS is bundled
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'db-personalization-widget.bundle.css';
          }
          return assetInfo.name;
        }
      }
    }
  }
};


export default {
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'DubbotPersonalizationWidget',
      fileName: () => 'db-personalization-widget.bundle.js',
      formats: ['iife']
    }
  }
};


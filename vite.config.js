export default {
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'DubbotPersonalizationWidget',
      fileName: () => 'widget.bundle.js',
      formats: ['iife']
    }
  }
};


import { readFileSync, writeFileSync } from 'fs';

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
      output: {
        // Prevent CSS extraction - we want everything in JS
        inlineDynamicImports: true
      }
    },
    // Inline CSS into JS bundle
    cssCodeSplit: false
  },
  plugins: [
    {
      name: 'create-dist-test-html',
      writeBundle() {
        // Read the index.html file
        const indexHtml = readFileSync('index.html', 'utf-8');

        // Replace the module script with the bundled script
        const distTestHtml = indexHtml
          .replace(
            '<script type="module" src="/src/main.js"></script>',
            '<script src="./db-personalization-widget.bundle.js"></script>'
          )
          .replace(
            '<title>Dubbot Personalization Widget</title>',
            '<title>Dubbot Personalization Widget - Production Test</title>'
          );

        // Write the modified HTML to dist folder
        writeFileSync('dist/dist-test.html', distTestHtml);
        console.log('✓ Created dist/dist-test.html');
      }
    }
  ]
};


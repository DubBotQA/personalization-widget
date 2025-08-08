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

        // Create standard dist test file
        const distTestHtml = indexHtml
          .replace(
            '<script type="module" src="/src/main.js"></script>',
            '<script src="./db-personalization-widget.bundle.js"></script>'
          )
          .replace(
            '<title>Dubbot Personalization Widget</title>',
            '<title>Dubbot Personalization Widget - Production Test</title>'
          );

        // Create config test file with configuration
        const distTestConfigHtml = indexHtml
          .replace(
            '<script type="module" src="/src/main.js"></script>',
            '<script src="./db-personalization-widget.bundle.js" data-db-personalization-widget-config-url="./sample-config.json"></script>'
          )
          .replace(
            '<title>Dubbot Personalization Widget</title>',
            '<title>Dubbot Personalization Widget - Config Test</title>'
          )
          .replace(
            '<h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 0;">Personalization Widget Demo</h1>',
            '<h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; margin-top: 0;">Personalization Widget Demo - With Custom Config</h1>'
          );

        writeFileSync('dist/dist-test.html', distTestHtml);
        console.log('✓ Created dist/dist-test.html');

        writeFileSync('dist/dist-test-config.html', distTestConfigHtml);
        console.log('✓ Created dist/dist-test-config.html');

        // Copy sample-config.json to dist folder
        const sampleConfig = readFileSync('sample-config.json', 'utf-8');
        writeFileSync('dist/sample-config.json', sampleConfig);
        console.log('✓ Copied sample-config.json to dist/');
      }
    }
  ]
};


import { defineConfig } from '@rsbuild/core';
import { pluginPreact } from '@rsbuild/plugin-preact';

export default defineConfig({
  plugins: [pluginPreact()],
  server: {
    port: 3001,
    strictPort: true,
    open: false,
  },
  html: {
    title: 'Cart',
  },
});

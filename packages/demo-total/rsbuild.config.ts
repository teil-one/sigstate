import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 3002,
    strictPort: true,
    open: false,
  },
  html: {
    title: 'Total',
  },
});

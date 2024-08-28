import { defineConfig } from '@rsbuild/core';

export default defineConfig({
  html: {
    title: 'Shell',
  },
  server: {
    open: {
      before: () => new Promise((resolve) => setTimeout(resolve, 1000)),
    },
  },
});

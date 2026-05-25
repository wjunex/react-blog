import { defineConfig } from 'orval';

export default defineConfig({
  blog: {
    input: 'https://api.wjun.me/v3/api-docs',
    output: {
      mode: 'single',
      target: 'src/api/generated/index.ts',
      schemas: 'src/api/generated/models',
      indexFiles: true,
      clean: true,
      override: {
        mutator: {
          path: 'src/api/mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
});

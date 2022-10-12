import { defineConfig } from 'vite'

export default defineConfig({
  root: './tests/e2e/server',
  server: {
    port: 5_173,
    strictPort: true,
  },
})

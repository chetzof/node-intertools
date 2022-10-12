// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  clearScreen: true,
  test: {
    clearMocks: true,
    exclude: ['tests/e2e/**/*'],
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
})

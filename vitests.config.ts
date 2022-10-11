// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  clearScreen: true,
  test: {
    include: ['tests/**/*.test.ts'],
    globals: true,
    clearMocks: true,
  },
})

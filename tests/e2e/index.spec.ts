import { test, expect } from '@playwright/test'

import { createServer } from '../../src/node/shared/server'

test('the contains the endpoint response', async ({ page }) => {
  const server = createServer()
  await server.listen({ port: 9_000 })
  await page.goto('http://127.0.0.1:5173/')

  // create a locator
  await expect(page.locator('h1')).toHaveText('Example Domain')

  await server.close()
})

// eslint-disable-next-line import/no-unresolved
import got from 'got'
import { afterAll, beforeAll, expect, it } from 'vitest'

import { createServer } from '../src/server'
import {
  createTargetServer,
  getServerPort,
  removeCacheDir,
  testEndpoint,
} from '../src/utils'

const proxyServer = createServer({ ttl: 100 })

beforeAll(async () => {
  await removeCacheDir()
  await proxyServer.listen()
})
afterAll(async () => {
  await removeCacheDir()
  await proxyServer.close()
})

it(
  'test',
  () =>
    new Promise<void>((resolve) => {
      const { targetServer, spyHandler } = createTargetServer()
      targetServer.listen(0, async () => {
        const endpoint = `http://localhost:${getServerPort(
          proxyServer.server,
        )}/http://localhost:${getServerPort(targetServer)}${testEndpoint}`
        const response = await got(endpoint).text()
        expect(response).toBe('hit')
        const response1 = await got(endpoint).text()
        expect(response1).toBe('hit')
        expect(spyHandler).toHaveBeenCalledOnce()
        resolve()
      })
    }),
  { timeout: 500 },
)

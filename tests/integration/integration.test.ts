// eslint-disable-next-line import/no-unresolved
import { promisify } from 'util'

import got from 'got'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

import { createServer, getServerPort } from '../../src/node/shared/server'
import { createTargetServer, removeCacheDir, testEndpoint } from '../utils'

const proxyServer = createServer({ cors: false, ttl: 10 })
const { targetServer, spyHandler } = createTargetServer()
const targetListener = promisify((callback) => targetServer.listen(callback))
// @ts-expect-error Callback
const targetClose = promisify((callback) => targetServer.close(callback))

beforeAll(async () => {
  await removeCacheDir()
  await targetListener()
  await proxyServer.listen()
})

afterEach(async () => {
  await removeCacheDir()
})
afterAll(async () => {
  await removeCacheDir()
  await proxyServer.close()
  await targetClose()
})

it('integration test with listeners', async () => {
  const endpoint = `http://localhost:${getServerPort(
    proxyServer.server,
  )}/http://localhost:${getServerPort(targetServer)}${testEndpoint}`
  const response = await got(endpoint).text()
  expect(response).toBe('hit')
  const response1 = await got(endpoint).text()
  expect(response1).toBe('hit')
  expect(spyHandler).toHaveBeenCalledOnce()
})

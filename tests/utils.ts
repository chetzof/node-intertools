import { promises as fs } from 'fs'
import { createServer } from 'http'
import path from 'path'

import { vi } from 'vitest'

export const testEndpoint = '/fake-endpoint'
export const cacheKey =
  'https://raw.githubusercontent.com/fastify/fastify-reply-from/master/index.js'
export const cacheDir = path.resolve('./node_modules/.cache/node-intercache')
export const cacheHashedKey =
  '4f1ff68094bf6a62d69d7cb9ef4b0ecbc22b3239fe129a9c54484cd72f3e2795'
export const cachePath = path.join(cacheDir, cacheHashedKey)

export const removeCacheDir = async (): Promise<void> =>
  await fs.rm(cachePath, { recursive: true, force: true })

export function createTargetServer(): {
  spyHandler: ReturnType<typeof vi.fn>
  targetServer: ReturnType<typeof createServer>
} {
  const spyHandler = vi.fn((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('hit')
  })
  return {
    spyHandler,
    targetServer: createServer(spyHandler),
  }
}

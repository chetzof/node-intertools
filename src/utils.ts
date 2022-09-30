import { promises as fs } from 'fs'
import path from 'path'

export const cacheKey =
  'https://raw.githubusercontent.com/fastify/fastify-reply-from/master/index.js'
export const cacheDir = path.resolve('./node_modules/.cache/node-intercache')
export const cacheHashedKey =
  '4f1ff68094bf6a62d69d7cb9ef4b0ecbc22b3239fe129a9c54484cd72f3e2795'
export const cachePath = path.join(cacheDir, cacheHashedKey)

export const removeCacheDir = async (): Promise<void> =>
  await fs.rm(cachePath, { recursive: true, force: true })

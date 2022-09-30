import { promises as fs } from 'fs'

// eslint-disable-next-line import/no-unresolved
import got from 'got'
import { afterAll, afterEach, beforeEach, expect, it } from 'vitest'

import { intercept } from '../src'
import { cachePath, removeCacheDir } from '../src/utils'

beforeEach(removeCacheDir)
afterAll(removeCacheDir)

const testURL =
  'https://raw.githubusercontent.com/fastify/fastify-reply-from/master/index.js'

it('test that passing 0 to ttl disables cache', async () => {
  const done = intercept({ ttl: 0 })
  await got.get(testURL).text()
  await got.get(testURL).text()
  await expect(() => fs.readFile(cachePath)).rejects.toThrow()
  done()
})

it('test that passing non-0 ttl enables cache for any repeated request', async () => {
  const done = intercept({ ttl: 100 })
  await expect(() => fs.readFile(cachePath)).rejects.toThrow()
  await got.get(testURL).text()
  await got.get(testURL).text()
  await expect(fs.readFile(cachePath)).resolves.toBeInstanceOf(Buffer)
  done()
})

afterEach(() => {
  // nock.cleanAll()
  // nock.restore()
})

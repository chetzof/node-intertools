import { promises as fs } from 'node:fs'
import { setTimeout } from 'timers/promises'

import { expect, it, beforeEach } from 'vitest'

import { FileCache } from '../../src/node/shared/file-cache'
import { cacheKey, cachePath, removeCacheDir } from '../utils'

beforeEach(removeCacheDir)

it('setting a cache key creates a test file', async () => {
  const fileCache = new FileCache()
  await fileCache.set(cacheKey, 'somevalue')

  const data = await fs.readFile(cachePath)

  expect(data.toString()).toEqual('somevalue')
})

it('getting an existing cache key return file contents on existing file', async () => {
  const key = 'somekey'
  const value = 'somevalue'
  const fileCache = new FileCache()
  await fileCache.set(key, value)
  expect(await fileCache.get(key)).toEqual(value)
})

it('getting a non-existing cache key returns undefined', async () => {
  const fileCache = new FileCache()
  expect(await fileCache.get('food')).toEqual(undefined)
})

it('getting an existing key with 0 ttl return undefined', async () => {
  const fileCache = new FileCache({ ttl: 0 })
  await fileCache.set('foo', 'bar')
  expect(await fileCache.get('foo')).toEqual(undefined)
})

it('getting an existing key with expired ttl returns undefined', async () => {
  const fileCache = new FileCache({ ttl: 1 })
  await fileCache.set('foo', 'bar')
  await setTimeout(1_200)
  expect(await fileCache.get('foo')).toEqual(undefined)
})

it('getting an existing key with non-expired ttl returns its value', async () => {
  const fileCache = new FileCache({ ttl: 1 })
  await fileCache.set('foo', 'bar')
  await setTimeout(500)
  expect(await fileCache.get('foo')).toEqual('bar')
})

it('calling deleteAll() should remove the cache folder', async () => {
  const fileCache = new FileCache()
  await fileCache.set('foo', 'bar')
  await FileCache.deleteAll()
  await expect(async () => await fs.readFile(cachePath)).rejects.toThrow()
})

import { createHash } from 'crypto'
import { promises as fs, Stats } from 'fs'

import findCacheDir from 'find-cache-dir'

const thunk = findCacheDir({ name: 'node-intercache', thunk: true })

function mapKey(key, segment) {
  if (typeof key === 'string') {
    return `${segment}:${key}`
  }
  return `${key.segment || segment}:${key.id}`
}

function getCacheDirThunk(file?: string): string {
  return file ? thunk(file) : thunk()
}

async function cacheFileExists(filePath: string): Promise<Stats | undefined> {
  try {
    return await fs.stat(filePath)
  } catch {
    return undefined
  }
}

async function getCacheFilePath(fileName: string) {
  return getCacheDirThunk(getFileHash(fileName))
}

function getFileHash(x) {
  return createHash('sha256').update(x).digest('hex')
}

class FileCache {
  constructor(protected segment: string, protected ttl: number | undefined) {}

  async get(key: string): Promise<string | undefined> {
    const path = await getCacheFilePath(key)
    const stat = await cacheFileExists(path)

    if (!stat) {
      return
    }

    if (this.ttl !== undefined) {
      const maxAgeMs = Date.now() - this.ttl * 1000

      if (maxAgeMs >= Math.trunc(stat.birthtimeMs)) {
        await fs.unlink(path)
        return
      }
    }

    const buffer = await fs.readFile(path)
    return buffer.toString()
  }

  async set(key: string, value: string) {
    await fs.mkdir(getCacheDirThunk(), { recursive: true })
    await fs.writeFile(await getCacheFilePath(key), value)
  }
}

const cacheProto = {
  delete: function (key, callback) {
    this._cache.delete(mapKey(key, this._segment))
    callback(null)
  },

  get: async function (key: string): Promise<string | undefined> {
    const path = await getCacheFilePath(key)
    const stat = await cacheFileExists(path)

    if (!stat) {
      return
    }

    if (this.ttl !== undefined) {
      const maxAgeMs = Date.now() - this.ttl * 1000

      if (maxAgeMs >= Math.trunc(stat.birthtimeMs)) {
        await fs.unlink(path)
        return
      }
    }

    const buffer = await fs.readFile(path)
    return buffer.toString()

    // const _key = mapKey(key, this._segment)
    // const obj = this._cache.get(_key)
    // if (!obj) {
    //   return callback(null, null)
    // }
    // const now = Date.now()
    // const expires = obj.ttl + obj.stored
    // const ttl = expires - now
    // if (ttl < 0) {
    //   this._cache.delete(_key)
    //   return callback(null, null)
    // }
    // callback(null, {
    //   item: clone(obj.item),
    //   stored: obj.stored,
    //   ttl,
    // })
  },

  has: function (key, callback) {
    callback(null, this._cache.has(mapKey(key, this._segment)))
  },

  set: async function (key: string, value: string, ttl) {
    await fs.mkdir(getCacheDirThunk(), { recursive: true })
    await fs.writeFile(await getCacheFilePath(key), value)

    // console.log('aaa')
    // console.log(mapKey(key, this._segment))
    // this._cache.set(mapKey(key, this._segment), {
    //   ttl: ttl,
    //   item: value,
    //   stored: Date.now(),
    // })
  },
}

export function createFileCache(config = {}) {
  const _config = config || {}
  const _segment = _config.segment || 'abstractMemcache'
  const _maxItems =
    _config.maxItems && Number.isInteger(_config.maxItems)
      ? _config.maxItems
      : 100_000
  const map = {}
  const cache = Object.create(cacheProto)
  Object.defineProperties(cache, {
    await: {
      value: false,
    },
    ttl: {
      value: config.ttl,
    },
    _cache: {
      enumerable: false,
      value: map,
    },
    _segment: {
      enumerable: false,
      value: _segment,
    },
  })
  return cache
}

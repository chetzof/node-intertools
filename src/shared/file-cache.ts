import { createHash } from 'crypto'
import { promises as fs, Stats } from 'fs'

import { getCacheDirThunk } from './misc'

async function cacheFileExists(filePath: string): Promise<Stats | undefined> {
  try {
    return await fs.stat(filePath)
  } catch {
    return undefined
  }
}

function getCacheFilePath(fileName: string): string {
  return getCacheDirThunk(getFileHash(fileName))
}

function getFileHash(x: string): string {
  return createHash('sha256').update(x).digest('hex')
}

export class FileCache {
  readonly ttl: number

  constructor({ ttl = 10 }: { ttl?: number } = {}) {
    this.ttl = ttl
  }

  static async deleteAll(): Promise<void> {
    await fs.rm(getCacheDirThunk(), { recursive: true, force: true })
  }

  async get(key: string): Promise<string | undefined> {
    const path = getCacheFilePath(key)
    const stat = await cacheFileExists(path)
    if (!stat) {
      return
    }

    const maxAgeMs = Date.now() - this.ttl * 1000

    if (maxAgeMs >= Math.trunc(stat.birthtimeMs)) {
      await fs.unlink(path)
      return
    }

    const buffer = await fs.readFile(path)
    return buffer.toString()
  }

  async set(key: string, value: string): Promise<void> {
    await fs.mkdir(getCacheDirThunk(), { recursive: true })

    await fs.writeFile(getCacheFilePath(key), value)
  }
}

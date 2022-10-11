import findCacheDir from 'find-cache-dir'

const thunk = findCacheDir({ name: 'node-intercache', thunk: true })

export function getCacheDirThunk(file?: string): string {
  return file ? thunk(file) : thunk()
}

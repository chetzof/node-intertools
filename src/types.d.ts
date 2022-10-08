declare module 'find-cache-dir' {
  export default function findCacheDir(
    options: findCacheDir.OptionsWithThunk,
  ): (...pathParts: string[]) => string
}

declare module 'pino-colada' {
  export default function (): (...args: any[]) => any
}

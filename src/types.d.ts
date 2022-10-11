declare module 'find-cache-dir' {
  export default function findCacheDir(
    options: findCacheDir.OptionsWithThunk,
  ): (...pathParts: string[]) => string
}

declare module 'pino-colada' {
  export default function (): (...args: any[]) => any
}

declare module 'cors-anywhere' {
  import { type createServer as http } from 'http'

  export const createServer: (
    options: Record<string, string>,
  ) => ReturnType<typeof http>
}

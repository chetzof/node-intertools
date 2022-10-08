import pino from 'pino'
import pinoColada from 'pino-colada'
import pinoPretty from 'pino-pretty'

import { getCacheDirThunk } from './shared/misc'

export const logFilePath = getCacheDirThunk('log')
export type Logger = ReturnType<typeof pino>
let logger: Logger | undefined

export function createFileLogger(): Logger {
  return pino(pino.destination(getCacheDirThunk('log')))
}

export function createStdoutLogger(): Logger {
  return pino(
    pinoPretty({
      ignore: 'pid,hostname,name,time',
      hideObject: true,
      levelKey: '',
      messageFormat: pinoColada(),
      singleLine: true,
    }),
  )
}

export function getLogger(): Logger {
  if (logger === undefined) {
    logger = createStdoutLogger()
  }

  return logger
}

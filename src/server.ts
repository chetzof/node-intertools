#!/usr/bin/env node
import { createServer } from './index'

const start = async (): Promise<void> => {
  const server = createServer()

  try {
    await server.listen({ port: 3000 })
  } catch (error) {
    server.log.error(error)
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1)
  }
}

void start()

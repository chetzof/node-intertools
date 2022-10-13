import { Command, Flags } from '@oclif/core'

import { getLogger } from '../../shared/logger'
import { createServer, getServerPort } from '../../shared/server'

export default class StartServer extends Command {
  public static override description = 'Start proxy server'

  public static override flags = {
    port: Flags.integer({ default: 9_555, min: 0 }),
    ttl: Flags.integer({ default: 10, min: 0 }),
  }

  public async run(): Promise<void> {
    const logger = getLogger()
    const { flags } = await this.parse(StartServer)
    const server = createServer({ logger, ttl: flags.ttl })
    try {
      await server.listen({ port: flags.port })
    } catch (error) {
      server.log.error(error)
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    }

    logger.info(
      `Proxy server running on http://localhost:${getServerPort(
        server.server,
      )}/`,
    )
  }
}

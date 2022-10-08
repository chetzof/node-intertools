import { Command, Flags } from '@oclif/core'

import { getLogger } from '../../logger'
import { createServer, getServerPort } from '../../shared/server'

export default class StartServer extends Command {
  static override description = 'Start proxy server'
  static override flags = {
    port: Flags.integer({ min: 0, default: 3000 }),
    ttl: Flags.integer({ min: 0, default: 10 }),
  }
  public async run(): Promise<void> {
    const logger = getLogger()
    const { flags } = await this.parse(StartServer)
    const server = await createServer({ ttl: flags.ttl, logger })
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

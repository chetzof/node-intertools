import { Command } from '@oclif/core'
import { Tail } from 'tail'

import { getLogger, logFilePath } from '../../shared/logger'

export default class ShowLogs extends Command {
  public static override description = 'Display interception logs'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public run(): any {
    const tail = new Tail(logFilePath)
    tail.on('line', (data) => {
      getLogger().info(JSON.parse(data))
    })
  }
}

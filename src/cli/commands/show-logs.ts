import { Command } from '@oclif/core'
import { Tail } from 'tail'

import { getLogger, logFilePath } from '../../logger'

export default class ShowLogs extends Command {
  static override description = 'Display interception logs'

  public run() {
    const tail = new Tail(logFilePath)
    tail.on('line', (data) => {
      getLogger().info(JSON.parse(data))
    })
  }
}

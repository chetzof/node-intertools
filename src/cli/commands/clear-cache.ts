import { Command } from '@oclif/core'

import { FileCache } from '../../shared/file-cache'

export default class ClearCache extends Command {
  static override description = 'Remove the cached responses'

  public async run(): Promise<void> {
    await FileCache.deleteAll()
    this.log('Cache cleared!')
  }
}

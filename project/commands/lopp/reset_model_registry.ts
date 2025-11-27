import { loppPlugin } from '#lopp'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class resetMR extends BaseCommand {
  static commandName = 'lopp:reset-model-registry'
  static description = ''

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    console.log("Resetting model registry.")
    await loppPlugin.modelRegistry.reset() 
    console.log("Done.")
  }
}
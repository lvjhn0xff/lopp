import { loppPlugin } from '#lopp/core/plugin'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class UpdateMR extends BaseCommand {
  static commandName = 'lopp:update-model-registry'
  static description = 'Updates the model registry.'

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    console.log("Updating model registry.")
    loppPlugin.modelRegistry.verbose =  true
    await loppPlugin.modelRegistry.loadModelMapping()
    await loppPlugin.modelRegistry.update()
    console.log("Done.")
  }
}
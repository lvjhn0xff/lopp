import { D } from '#models/sanity-check'
import { B, C } from '#models/sanity-check'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class SideTask extends BaseCommand {
  static commandName = 'side:task'
  static description = ''

  static options: CommandOptions = {
    startApp: true
  }

  async run() {

  }
}
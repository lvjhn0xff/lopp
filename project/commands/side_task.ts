import { LoppHelpers } from '#lopp'
import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { check } from '../check.js'

export default class SideTask extends BaseCommand {
  static commandName = 'side:task'
  static description = ''

  static options: CommandOptions = {
    startApp: true
  }

  async run() {
    await check()
  }
}
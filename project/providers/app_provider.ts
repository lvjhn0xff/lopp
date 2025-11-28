import { loppPlugin } from '#lopp/core/plugin'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {
    loppPlugin.modelRegistry.setScanLocations({
      "./app/models" : "#models/"
    }) 
  }

  /**
   * The application has been booted
   */
  async start() {
    loppPlugin.start(this.app)
  }

  /**
   * The process has been started
   */
  async ready() {
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
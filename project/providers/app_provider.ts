import { loppPlugin, LoppPlugin } from '#lopp'
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
      "./app/models" : "#models/", 
      "./extras/test-models/" : "#test-models/"
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
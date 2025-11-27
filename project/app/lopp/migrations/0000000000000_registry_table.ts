import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = '__MODEL_REGISTRY__'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable().index()
      table.string('model_name').notNullable().primary()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
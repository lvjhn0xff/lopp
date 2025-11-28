// @ts-nocheck

import { makePolymorphic } from '#lopp/core/polymorphic_schema'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'MediaContent'

  async up() {    
    createPolymorphic(this.schema)(() => {
      return new class MediaContent {
        static Photo = 
          MediaContent.extend(table => [
            table.string("username"),
            table.string("password")
          ])

        static Audio = 
          MediaContent.extend(table => [
            table.string("username"),
            table.string("password")
          ])

        static Video = 
          MediaContent.extend(table => [
            table.string("username"),
            table.string("password")
          ])
      }
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'


export default class RegistryTable extends BaseModel {
  static table = "__MODEL_REGISTRY__"

  @column() 
  declare id: number 

  @column() 
  declare modelName: string
}
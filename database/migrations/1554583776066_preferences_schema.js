'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PreferencesSchema extends Schema {
  up () {
    this.create('preferences', table => {
      table.increments()
      table.string('name').notNullable()
    })
  }

  down () {
    this.drop('preferences')
  }
}

module.exports = PreferencesSchema

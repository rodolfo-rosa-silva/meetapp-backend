'use strict'

const Schema = use('Schema')

class MeetupPreferencesSchema extends Schema {
  up () {
    this.create('meetup_preferences', table => {
      table.increments()
      table
        .integer('meetup_id')
        .unsigned()
        .references('id')
        .inTable('meetups')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('preference_id')
        .unsigned()
        .references('id')
        .inTable('preferences')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('meetup_preferences')
  }
}

module.exports = MeetupPreferencesSchema

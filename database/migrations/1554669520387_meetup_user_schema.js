'use strict'

const Schema = use('Schema')

class MeetupUserSchema extends Schema {
  up () {
    this.create('meetup_users', table => {
      table.increments()
      table
        .integer('meetup_id')
        .unsigned()
        .references('id')
        .inTable('meetups')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('meetup_users')
  }
}

module.exports = MeetupUserSchema

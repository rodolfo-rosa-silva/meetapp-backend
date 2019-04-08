'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MeetupSchema extends Schema {
  up () {
    this.create('meetups', table => {
      table.increments()
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.string('location').notNullable()
      table.datetime('datetime').notNullable()
      table
        .integer('file_id')
        .unsigned()
        .references('id')
        .inTable('files')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
    })
  }

  down () {
    this.drop('meetups')
  }
}

module.exports = MeetupSchema

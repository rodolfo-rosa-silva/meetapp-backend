'use strict'

const Schema = use('Schema')

class MeetupUsersAddConfirmationSchema extends Schema {
  up () {
    this.table('meetup_users', table => {
      // alter table
      table.boolean('confirmation').defaultTo(0)
    })
  }

  down () {
    this.table('meetup_users', table => {
      // reverse alternations
      table.dropColumn('confirmation')
    })
  }
}

module.exports = MeetupUsersAddConfirmationSchema

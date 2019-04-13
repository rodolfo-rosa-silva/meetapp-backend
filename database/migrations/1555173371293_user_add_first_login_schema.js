'use strict'

const Schema = use('Schema')

class UserAddFirstLoginSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.boolean('first_login').defaultTo(0)
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.dropColumn('first_login')
    })
  }
}

module.exports = UserAddFirstLoginSchema

'use strict'

const Model = use('Model')

class MeetupUser extends Model {
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = MeetupUser

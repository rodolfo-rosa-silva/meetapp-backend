'use strict'

const Model = use('Model')

class MeetupPreference extends Model {
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = MeetupPreference

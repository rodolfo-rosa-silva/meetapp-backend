'use strict'

const Model = use('Model')

class UserPreference extends Model {
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = UserPreference

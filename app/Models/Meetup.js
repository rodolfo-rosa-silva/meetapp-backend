'use strict'

const Model = use('Model')

class Meetup extends Model {
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

  file () {
    return this.belongsTo('App/Models/File')
  }

  subscriptions () {
    return this.belongsToMany('App/Models/User').pivotModel(
      'App/Models/MeetupUser'
    )
  }

  themes () {
    return this.belongsToMany('App/Models/Preferences').pivotModel(
      'App/Models/MeetupPreference'
    )
  }
}

module.exports = Meetup

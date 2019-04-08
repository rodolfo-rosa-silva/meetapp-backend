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
    return this.hasOne('App/Models/File')
  }

  meetups () {
    return this.belongsToMany('App/Models/Meetups').pivotModel(
      'App/Models/MeetupUser'
    )
  }
}

module.exports = Meetup

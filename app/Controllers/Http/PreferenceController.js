'use strict'

const Preferences = use('App/Models/Preference')

class PreferenceController {
  async index ({ request, response, view }) {
    const preferences = await Preferences.all()

    return preferences
  }

  async store ({ request, response }) {}

  async show ({ params, request, response, view }) {}

  async update ({ params, request, response }) {}

  async destroy ({ params, request, response }) {}
}

module.exports = PreferenceController

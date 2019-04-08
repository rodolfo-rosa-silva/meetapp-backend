'use strict'

const Preferences = use('App/Models/Preference')
const UserPreference = use('App/Models/UserPreference')

class PreferenceController {
  async index ({ request, response, view }) {
    const preferences = await Preferences.all()

    return preferences
  }

  async store ({ request, response, auth }) {
    const user_id = auth.user.id
    const data = request.only(['preferences'])
    const preferences_ids = data.preferences

    preferences_ids.forEach(async preference_id => {
      await UserPreference.create({
        user_id: user_id,
        preference_id: preference_id
      })
    })

    return response
      .status(201)
      .json({ message: 'Preferências salvas com sucesso' })
  }

  async show ({ params, request, response, view }) {}

  async update ({ params, request, response }) {}

  async destroy ({ params, request, response }) {}
}

module.exports = PreferenceController

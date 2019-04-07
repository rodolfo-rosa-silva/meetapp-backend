'use strict'

const UserPreference = use('App/Models/UserPreference')

class UserPreferenceController {
  async index ({ request, response, view }) {}

  async store ({ request, response, auth }) {
    const user_id = auth.user.id
    const data = request.only(['preferences_ids'])
    const preferences_ids = data.preferences_ids

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

module.exports = UserPreferenceController

'use strict'

const User = use('App/Models/User')
const UserPreference = use('App/Models/UserPreference')
const Preferences = use('App/Models/Preference')

class UserController {
  async store ({ request, response, auth }) {
    const data = request.only(['username', 'email', 'password'])

    try {
      const user = await User.create(data)

      const token = await auth.attempt(data.email, data.password)

      return response.status(201).json({
        message: 'Usuário salvo com sucesso',
        user,
        token: token.token
      })
    } catch (err) {
      return response.status(err.status).send({ message: err.message })
    }
  }

  async update ({ request, response, auth }) {
    try {
      const user_id = auth.user.id
      const { username, password, preferences } = request.all()
      const data_user = { username: username, password: password }

      const user = await User.findByOrFail('id', user_id)

      user.merge(data_user)

      await user.save()

      // Se vier a lista de preferencias, apaga todas e recadastra a nova lista
      if (preferences && preferences.length > 0) {
        await UserPreference.query()
          .where('user_id', user_id)
          .delete()

        preferences.forEach(async preference_id => {
          await UserPreference.create({
            user_id: user_id,
            preference_id: preference_id
          })
        })
      }

      return response
        .status(201)
        .json({ message: 'Usuário editado com sucesso' })
    } catch (err) {
      return response.status(err.status).send({ message: err.message })
    }
  }

  async show ({ request, response, auth }) {
    const userId = auth.user.id
    const user = await User.query()
      .where('id', userId)
      .fetch()

    const findUserPreferences = await UserPreference.query()
      .where('user_id', userId)
      .fetch()

    const IdsUserPreferences = findUserPreferences.rows.map(
      item => item.preference_id
    )

    const preferences = await Preferences.all()

    return response.json({
      user: user.rows[0],
      userPreferences: IdsUserPreferences,
      preferences
    })
  }
}

module.exports = UserController

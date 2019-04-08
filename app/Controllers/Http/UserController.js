'use strict'

const User = use('App/Models/User')
const UserPreference = use('App/Models/UserPreference')

class UserController {
  async store ({ request, response }) {
    const data = request.only(['username', 'email', 'password'])

    try {
      const user = await User.create(data)

      return response
        .status(201)
        .json({ message: 'Usuário salvo com sucesso', data: user })
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
}

module.exports = UserController

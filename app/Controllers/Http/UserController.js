'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({ request, response }) {
    const data = request.only(['username', 'email', 'password'])

    try {
      const user = await User.create(data)

      return response
        .status(201)
        .json({ message: 'Usuário salvo com sucesso', data: user })
    } catch (err) {}
  }
}

module.exports = UserController

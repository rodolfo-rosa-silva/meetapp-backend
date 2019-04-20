'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class SessionController {
  async store ({ request, response, auth }) {
    const { email, password } = request.all()

    const user = await User.findBy('email', email)

    if (!user) {
      return response.status(401).json({ message: 'Usuário não encontrado' })
    }

    const isSame = await Hash.verify(password, user.password)

    if (!isSame) {
      return response
        .status(401)
        .json({ message: 'E-mail ou senha incorretos' })
    }

    const token = await auth.attempt(email, password)

    const redirectUrl = user.first_login > 0 ? '/dashboard' : '/preferences'

    return response.status(201).json({
      message: 'Login realizado com sucesso',
      token: token.token,
      user_id: user.id,
      username: user.username,
      redirectUrl: redirectUrl
    })
  }
}

module.exports = SessionController

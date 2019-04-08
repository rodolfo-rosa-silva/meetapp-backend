'use strict'

const Route = use('Route')

// Cadastro
Route.post('signup', 'UserController.store').validator('User')

// Login
Route.post('signin', 'SessionController.store')

// Exibicao de files
Route.get('/files/:file', 'FileController.show')

// Rotas que precisa estar logado
Route.group(() => {
  // Lista as preferencias apos fazer o login
  Route.get('preferences', 'PreferenceController.index')

  // Salva as preferencias salvas apos fazer o login
  Route.post('preferences/save', 'PreferenceController.store').validator(
    'PreferencesSave'
  )
  // Edita os dados do usuario
  Route.put('profile', 'UserController.update').validator('UserUpdate')

  // Cadastro de files
  Route.post('/files', 'FileController.store')

  // Cadastro de Meetup
  Route.post('meetup', 'MeetupController.store')
}).middleware(['auth'])

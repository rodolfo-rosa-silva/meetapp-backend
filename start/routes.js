'use strict'

const Route = use('Route')

// Cadastro
Route.post('signup', 'UserController.store').validator('User')

// Login
Route.post('signin', 'SessionController.store').validator('Signin')

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

  // Lista os dados do usuario para a edicao
  Route.get('profile', 'UserController.show')

  // Edita os dados do usuario
  Route.put('profile', 'UserController.update').validator('UserUpdate')

  // Cadastro de files
  Route.post('/files', 'FileController.store')

  // Dashboard (Lista de Meetups)
  Route.get('dashboard', 'MeetupController.index')

  // Cadastro de Meetup
  Route.post('meetup', 'MeetupController.store').validator('Meetup')

  // Detalhe do meetup
  Route.get('meetup/:id', 'MeetupController.show')

  // Inscricao no meetup
  Route.post('meetup/subscription', 'MeetupController.subscription').validator(
    'MeetupSubscription'
  )

  // Confirmacao no meetup
  Route.post(
    '/meetup/confirmation',
    'MeetupController.subscriptionConfirmation'
  ).validator('MeetupConfirmation')
}).middleware(['auth'])

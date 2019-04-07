'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.post('sessions', 'SessionController.store')

Route.group(() => {
  // Preferences list after login
  Route.get('preferences', 'PreferenceController.index')

  // Preferences save after login
  Route.post('preferences/save', 'UserPreferenceController.store')
}).middleware(['auth'])

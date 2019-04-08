'use strict'

const Antl = use('Antl')

class PreferencesSave {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      preferences: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = PreferencesSave

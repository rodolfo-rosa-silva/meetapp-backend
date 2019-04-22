'use strict'

const Antl = use('Antl')

class MeetupConfirmation {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      meetup_id: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = MeetupConfirmation

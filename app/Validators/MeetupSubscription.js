'use strict'

const Antl = use('Antl')

class MeetupSubscription {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      meetup_id: 'required|integer'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = MeetupSubscription

'use strict'

const Antl = use('Antl')

class Meetup {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      title: 'required',
      description: 'required',
      location: 'required',
      datetime: 'required|date',
      preferences: 'required|array',
      file_id: 'required|number'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Meetup

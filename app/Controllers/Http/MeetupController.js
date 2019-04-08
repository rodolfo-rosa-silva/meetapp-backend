'use strict'

const Meetup = use('App/Models/Meetup')

class MeetupController {
  async index ({ request, response, view }) {}

  async store ({ request, response }) {
    try {
      const data = request.only([
        'title',
        'description',
        'location',
        'datetime',
        'file_id'
      ])
      const meetup = await Meetup.create(data)

      return response
        .status(201)
        .json({ message: 'Meetup cadastrado com sucesso', data: meetup })
    } catch (err) {
      return response.status(err.status).send({ message: err.message })
    }
  }

  async show ({ params, request, response, view }) {}

  async update ({ params, request, response }) {}

  async destroy ({ params, request, response }) {}
}

module.exports = MeetupController

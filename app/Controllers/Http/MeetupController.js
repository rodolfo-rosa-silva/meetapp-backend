'use strict'

const UserPreference = use('App/Models/UserPreference')
const Meetup = use('App/Models/Meetup')
const MeetupPreference = use('App/Models/MeetupPreference')
const moment = use('moment')

class MeetupController {
  async index ({ params, request, response, view, auth }) {
    const user_id = auth.user.id
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    const { s } = request.get() // parametro para filtro pelo titulo do meetup
    const whereLikeTitle = s && s !== '' ? `meetups.title LIKE '%${s}%' ` : ''

    // próximos meetups que ainda não é inscrito
    const nextMeetups = await Meetup.query()
      .select('meetups.*')
      .with('file')
      .leftJoin('meetup_users', 'meetup_users.meetup_id', 'meetups.id')
      .where('datetime', '>', now)
      .whereRaw('(meetup_users.user_id IS NULL OR meetup_users.user_id <> ?)', [
        user_id
      ])
      .whereRaw(whereLikeTitle)
      .orderBy('datetime', 'DESC')
      .withCount('subscriptions')
      .fetch()
    // meetups os quais está inscrito e acontecerão em breve
    const subscriptions = await Meetup.query()
      .select('meetups.*')
      .with('file')
      .leftJoin('meetup_users', 'meetup_users.meetup_id', 'meetups.id')
      .where('datetime', '>', now)
      .where('meetup_users.user_id', user_id)
      .whereRaw(whereLikeTitle)
      .orderBy('datetime', 'DESC')
      .withCount('subscriptions')
      .fetch()

    // Busca as preferencias do usuario para adicionar na listagem abaixo
    const preferences = await UserPreference.query()
      .where('user_id', user_id)
      .fetch()

    const user_preferences = preferences.rows.map(objPreference => {
      return objPreference.preference_id
    })

    // meetups recomendados (de acordo com suas preferências) que ainda não é inscrito
    const nextRecommended = await Meetup.query()
      .select('meetups.*')
      .with('file')
      .leftJoin('meetup_users', 'meetup_users.meetup_id', 'meetups.id')
      .leftJoin(
        'meetup_preferences',
        'meetup_preferences.meetup_id',
        'meetups.id'
      )
      .where('datetime', '>', now)
      .whereRaw('(meetup_users.user_id IS NULL OR meetup_users.user_id <> ?)', [
        user_id
      ])
      .whereIn('meetup_preferences.preference_id', user_preferences)
      .whereRaw(whereLikeTitle)
      .groupBy('meetups.id')
      .orderBy('datetime', 'DESC')
      .withCount('subscriptions')
      .fetch()

    return response.status(201).json({
      nextMeetups: nextMeetups,
      subscriptions: subscriptions,
      nextRecommended: nextRecommended
    })
  }

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

      const dataPreferences = request.only(['preferences'])
      const preferences = dataPreferences.preferences

      if (preferences && preferences.length > 0) {
        preferences.forEach(async preference_id => {
          await MeetupPreference.create({
            meetup_id: meetup.id,
            preference_id: preference_id
          })
        })
      }

      return response
        .status(201)
        .json({ message: 'Meetup cadastrado com sucesso', data: meetup })
    } catch (err) {
      return response.status(err.status).send({ message: err.message })
    }
  }

  async show ({ params, request, response, view }) {
    const meetup = await Meetup.query()
      .where('id', params.id)
      .with('file')
      .withCount('subscriptions')
      .fetch()

    return meetup
  }
}

module.exports = MeetupController

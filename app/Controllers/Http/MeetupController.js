'use strict'

const User = use('App/Models/User')
const UserPreference = use('App/Models/UserPreference')
const Meetup = use('App/Models/Meetup')
const MeetupUser = use('App/Models/MeetupUser')
const MeetupPreference = use('App/Models/MeetupPreference')
const moment = use('moment')
const Kue = use('Kue')
const Job = use('App/Jobs/ConfirmMeetupMail')

class MeetupController {
  async index ({ request, response, auth }) {
    const user_id = auth.user.id
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    const { s } = request.get() // parametro para filtro pelo titulo do meetup
    const whereLikeTitle = s && s !== '' ? `meetups.title LIKE '%${s}%' ` : ''

    // próximos meetups que ainda não é inscrito
    const nextMeetups = await Meetup.query()
      .select('meetups.*')
      .with('file')
      .where('datetime', '>', now)
      .whereDoesntHave('subscriptions', builder => {
        builder.where('user_id', user_id)
      })
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
      .whereDoesntHave('subscriptions', builder => {
        builder.where('user_id', user_id)
      })
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

  async show ({ params, request, response, auth }) {
    const meetup = await Meetup.query()
      .where('id', params.id)
      .with('file')
      .withCount('subscriptions')
      .fetch()

    const checkSubscription = await MeetupUser.query()
      .where('meetup_id', params.id)
      .where('user_id', auth.user.id)
      .fetch()
    const subscrition = checkSubscription.rows.length > 0

    return response.status(201).json({ meetup: meetup.rows[0], subscrition })
  }

  async subscription ({ request, response, auth }) {
    const user_id = auth.user.id
    const { meetup_id } = request.only(['meetup_id'])

    const user = await User.findByOrFail('id', user_id)
    const meetup = await Meetup.findByOrFail('id', meetup_id)

    const checkSubscription = await MeetupUser.query()
      .where('user_id', user_id)
      .where('meetup_id', meetup_id)
      .fetch()

    if (checkSubscription.rows.length > 0) {
      return response
        .status(401)
        .json({ message: 'Você já está inscrito neste meetup' })
    }

    await MeetupUser.create({ meetup_id: meetup_id, user_id: user_id })

    const dateFormat = moment(meetup.datetime).format('DD/MM/YYYY')
    const hourFormat = moment(meetup.datetime).format('HH:mm')
    const redirectUrl = `${request.input('redirect_url')}`

    Kue.dispatch(
      Job.key,
      { user, meetup, dateFormat, hourFormat, redirectUrl },
      { attempts: 3 }
    )

    return response
      .status(201)
      .json({ message: 'Inscrição realizada com sucesso' })
  }
}

module.exports = MeetupController

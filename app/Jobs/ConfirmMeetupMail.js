'use strict'

const Mail = use('Mail')

class ConfirmMeetupMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'ConfirmMeetupMail-job'
  }

  async handle ({ user, meetup, dateFormat, hourFormat, redirectUrl }) {
    console.log(`Job: ${ConfirmMeetupMail.key}`)

    await Mail.send(
      ['emails.confirm_meetup'],
      {
        user: user.username,
        meetup: meetup.title,
        date: dateFormat,
        hour: hourFormat,
        link: redirectUrl
      },
      message => {
        message
          .to(user.email)
          .from('rodolfo.silva@meetapp.com.br', 'Rodolfo | Meetapp')
          .subject('Confirmação de participação')
      }
    )
  }
}

module.exports = ConfirmMeetupMail

'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')
const Drive = use('Drive')

class FileController {
  async show ({ params, response }) {
    const file = await File.findBy('file', params.file)

    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }

  async store ({ request, response }) {
    try {
      if (!request.file('file')) return

      const upload = request.file('file', { size: '2mb' })

      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (err) {
      return response.status(err.status).send({ message: err.message })
    }
  }

  async destroy ({ params, request, response }) {
    try {
      const file = await File.findOrFail(params.id)
      await Drive.delete(file.file)
      await file.delete()

      return response
        .status(201)
        .send({ message: 'Arquivo removido com sucesso ' })
    } catch (err) {
      return response
        .status(err.status)
        .send({ message: 'Erro ao deletar o arquivo' })
    }
  }
}

module.exports = FileController

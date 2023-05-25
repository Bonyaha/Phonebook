const contactsRouter = require('express').Router()
const Contact = require('../models/contact')

contactsRouter.get('/', (request, response) => {
  Contact.find({}).then((persons) => response.json(persons))
})
contactsRouter.get('/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})
contactsRouter.get('/info', (request, response, next) => {
  Contact.countDocuments({})
    .then((count) => {
      response.send(`<h3>Phonebook has info for ${count} people</h3>
        <p>${new Date()}</p> `)
    })
    .catch((error) => next(error))
})

contactsRouter.post('/', (request, response, next) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Fill in all information, please.',
    })
  } else if (!body.name) {
    return response.status(400).json({
      error: 'The name is missing.',
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'The number is missing.',
    })
  }

  const person = new Contact({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then((contact) => response.json(contact))
    .catch((error) => next(error))
})

contactsRouter.delete('/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})
contactsRouter.put('/:id', (request, response, next) => {
  const body = request.body
  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Fill in all information, please.',
    })
  } else if (!body.name) {
    return response.status(400).json({
      error: 'The name is missing.',
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'The number is missing.',
    })
  }
  const person = {
    name: body.name,
    number: body.number,
  }
  Contact.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedContact) => response.json(updatedContact))
    .catch((error) => next(error))
})

module.exports = contactsRouter

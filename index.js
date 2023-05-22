require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/contact')

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json()) //transforms JSON data of a request into a JavaScript object and then attaches it to the body property of the request object before the route handler is called
// Logging middleware based on the tiny configuration.
app.use(morgan('tiny'))
//shows the data sent in HTTP POST requests
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(express.static('build'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => response.json(persons))
})
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})
app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then((count) => {
      response.send(`<h3>Phonebook has info for ${count} people</h3>
        <p>${new Date()}</p> `)
    })
    .catch((err) => {
      console.log(err)
      response.status(500).send('Internal Server Error')
    })
})

app.post('/api/persons', (request, response) => {
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
  Person.exists({ name: body.name })
    .then((nameExists) => {
      if (nameExists) {
        return response.status(400).json({ error: 'name must be unique' })
      }
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person.save().then((contact) => response.json(contact))
    })
    .catch((error) => {
      console.error(error)
      response.status(500).send('Internal Server Error')
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedContact) => response.json(updatedContact))
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

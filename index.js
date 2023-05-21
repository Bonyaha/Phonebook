require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/contact')

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
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((contact) => response.json(contact))
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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)
  response.status(204).end()
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

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

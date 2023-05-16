const express = require('express')
const app = express()
app.use(express.json()) //transforms JSON data of a request into a JavaScript object and then attaches it to the body property of the request object before the route handler is called
const morgan = require('morgan')

// Logging middleware based on the tiny configuration.
app.use(morgan('tiny'))
//shows the data sent in HTTP POST requests
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]
const generatedId = () => {
  const id = persons.length > 0 ? Math.floor(Math.random() * 10000) : 0
  return id
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).send('Page not found')
  }
})
app.get('/info', (request, response) => {
  response.send(`<h3>Phonebook has info for ${persons.length} people</h3>
    <p>${new Date()}</p> `)
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
  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  const person = {
    id: generatedId(),
    name: body.name,
    number: body.number,
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

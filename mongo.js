const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://Roman:${password}@cluster1.d7mltpu.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Contact', noteSchema)

const contact = new Person({
  name,
  number,
})

if (name && number) {
  contact.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then((result) => {
    console.log('phonebook: ')
    result.forEach((i) => console.log(`${i.name} ${i.number}`))
    mongoose.connection.close()
  })
}

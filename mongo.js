const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Roman:${password}@cluster1.d7mltpu.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Contact', noteSchema)

const note = new Note({
  content: 'Mongoose is Easy',
  important: true,
})

/* note.save().then((result) => {
  console.log('note saved!')
  mongoose.connection.close()
}) */
Note.find({}).then((result) => {
  result.forEach((i) => console.log(i))
  mongoose.connection.close()
})

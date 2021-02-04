const { model, Schema } = require('mongoose')

const phonebookSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    minlength: 8
  }
})
const Person = model('Person', phonebookSchema)

module.exports = Person

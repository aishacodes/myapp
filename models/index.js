const { model, Schema } = require("mongoose");

const phonebookSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    required: true,
  },
});
const Person = model("Person", phonebookSchema);

module.exports = Person;

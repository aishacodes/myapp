const { model, Schema } = require("mongoose");

const phonebookSchema = new Schema({
  name: String,
  number: String,
});
const Person = model("Person", phonebookSchema);

module.exports = Person;

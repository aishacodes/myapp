const { model, Schema } = require("mongoose");

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = model("Person", phonebookSchema);

module.exports = Person;

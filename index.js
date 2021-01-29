const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models");
require("dotenv").config();

const dburl = process.env.db_URL;

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.log);
db.once("open", () => {
  console.log("DB connection successful");
});

app.use(express.json());
app.use(cors());
app.use(express.static("build"));

morgan.token("body", (req, res) => JSON.stringify(req.body));

//app.use(morgan("tiny")); //GET /api/persons 200 223 - 3.698 ms

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((err) => console.log(err));
});

app.get("/info", async (req, res) => {
  const created = new Date(Date.now());
  try {
    const personNo = await Person.countDocuments();
    res.send(
      `<div>Phonebook has info for ${personNo} people <br/><br/>  ${created} </div>`
    );
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/persons/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const person = await Person.findById(id);
    if (person) res.json(person);
    else res.status(404).end();
  } catch (error) {
    console.log(error);
  }
});
app.delete("/api/persons/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Person.findOneAndRemove(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
  }
});
app.post("/api/persons", async (req, res) => {
  const person = req.body;

  if (!person.name.trim()) return res.status(400).send('"name" is missing!');
  if (!person.number.trim())
    return res.status(400).send('"number" is missing!');
  try {
    const userExist = await Person.findOne({ name: person.name });

    if (userExist)
      return res.status(409).json({
        error: '"name" must be unique',
      });

    const newPerson = await new Person({
      name: person.name,
      number: person.number,
    });
    newPerson.save();
    res.status(201).json(person);
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app is running on ${PORT}`);
});

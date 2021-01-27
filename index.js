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

app.get("/info", (req, res) => {
  const created = new Date(Date.now());
  res.send(
    `<div>Phonebook has info for ${persons.length} people <br/><br/>  ${created} </div>`
  );
});
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id == id);
  if (person) res.json(person);
  else res.status(404).end();
});
app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  persons = persons.filter((person) => person.id != id);
  res.status(204).end();
});

const generateId = () => Math.random().toString(36).substring(2, 7);

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!person.name.trim()) return res.status(400).send('"name" is missing!');
  if (!person.number.trim())
    return res.status(400).send('"number" is missing!');

  const userExist = persons.find((pers) => pers.name == person.name.trim());

  if (userExist) return res.status(409).send("name must be unique");

  person.id = generateId();
  person.name = person.name.trim();
  persons = persons.concat(person);

  res.status(201).json(person);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app is running on ${PORT}`);
});

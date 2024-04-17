const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

let persons = [  
   {
     id: 1,
     name: "Anton",
     number: "123-456-32"
   },
   {
      id: 2,
      name: "Max",
      number: "023-12-87"
   },
   {
      id: 3,
      name: "Pekka",
      number: "09823-234"
   }
 ]
 app.get('/', (req, res) => {
   res.json('<h1>Minun Puhelinluettelo</h1>')
 })

 app.get('/api/persons', (req, res) => {
   res.json(persons);
 })

 app.get('/api/persons/:id', (req, res) => {
   const id = Number(req.params.id);
   const person = persons.find(person => person.id === id);
   if (person) {
      res.json(person);
   } else {
      res.send('<h2>User not found</h2>').status(404).end();
   }
 })

 const generateId = () => {
   const MaxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0
   return MaxId + 1;
 }

 app.post('/api/persons', (req, res) => {
   const body = req.body;
   if (!body.name || !body.number) {
      return res.status(400).json({
         error: "name or number missing"
      })
   }

   const person = {
      id: generateId(),
      name: body.name,
      number: body.number
   }
   persons = persons.concat(person);
   res.json(person);
 })

 app.put('/api/persons/:id', (req, res) => {
   const id = Number(req.params.id);
   const body = req.body;

   const personIndex = persons.findIndex(person => person.id === id);

   if (personIndex !== -1) {
      persons[personIndex].name = body.name;
      persons[personIndex].number = body.number;

      res.json(persons[personIndex])
   } else {
      res.status(404).json({error: 'Person not found'});
   }
 })

 app.delete('/api/persons/:id', (req, res) => {
   const id = Number(req.params.id);
   const personToDelete = persons.find(person => person.id === id);

   if (personToDelete) {
      persons = persons.filter(person => person.id !== id);
      res.status(204).end();
   } else {
      res.status(404).json({ error: 'Person not found' });
   }
 })


 const PORT = process.env.PORT || 3001
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
 })
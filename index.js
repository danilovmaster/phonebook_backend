const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send(`
        <p><a href="http://localhost:${PORT}/api/persons/">all </a></p>
        <p><a href="http://localhost:${PORT}/info">about </a></p>
        <ul>${persons.map(p => 
        `    <li><a href=/api/persons/${p.id}>${p.name} ${p.number}</a> </li>`)}</ul>`
)})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`
                    <p>phonebook has info for ${persons.length} people</p>
                    <p>${new Date()}</p>
                    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = +request.params.id

    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = +request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    let newId = Math.floor(Math.random() * 1000)
    if (persons.map(p => p.id).includes(newId)) {
        newId *= 2
    }
    return newId
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(404).json({error: "please add name or number"})
    }

    if(persons.map(p => p.name).includes(body.name)) {
        return response.status(404).json({error: 'name must be unique'})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons.concat(person)

    response.json(person)

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`App is working on ${PORT} port`)
})
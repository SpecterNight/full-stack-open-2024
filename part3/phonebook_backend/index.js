const express = require('express')
const morgan = require('morgan')

const app = express()

const PORT = process.env.PORT || 3001

app.use(express.json())

app.use(express.static('dist'))

morgan.token('post', (req)=>{
    if(req.method = "POST"){
        return JSON.stringify(req.body)
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

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
        name:"Mary Poppendieck",
        number:"39-23-6423122"
    }
]

const generateId = () =>{
    return Math.floor(Math.random()*500)
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/api/persons/:id',(request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request, response)=>{
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


app.post('/api/persons/', (request, response)=>{
    const body = request.body
    
    if(!body.name){
        return response.status(400).json({
            error: 'name is missing'
        })
    }else if(!body.number){
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    if(persons.find(p => p.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number 
    }

    persons.concat(person)

    response.json(person)
})

app.get('/info',(request, response)=>{
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
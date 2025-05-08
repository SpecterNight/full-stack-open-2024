require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

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

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id',(request, response, next)=>{
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request, response, next)=>{
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.post('/api/persons/', (request, response, next)=>{
    const {name, number}= request.body
    
    if(!name){
        return response.status(400).json({
            error: 'name is missing'
        })
    }else if(!number){
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const person = new Person({
        name: name,
        number: number,
    })

    person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    Person.findById(request.params.id)
        .then(person => {
            if(!person){
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson)
            })

        })
        .catch(error => next(error))
})

app.get('/info',(request, response)=>{
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
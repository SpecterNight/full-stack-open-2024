import { useEffect, useState } from "react"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import personService from './services/persons'
import Notification from "./components/Notification"
import './index.css'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [notificationContent, setNotification] = useState({ message: null, type: 'success' })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleCreate = (event) => {
    event.preventDefault()
    const person = nameExist()
    if (person) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one`)) {
        const changedPerson = { ...person, number: newNumber }
        personService.update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== changedPerson.id ? person : returnedPerson))
          })
          .catch( error => {
            setNotification({
              message: `${error.response.data.error}`,
              type: 'error'
            }
            )
            setTimeout(()=>{
              setNotification({message: null, type:'error'})
            },5000)
            setPersons(persons.filter(person => person.id !== changedPerson.id))
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({
            message: `Added ${returnedPerson.name}`,
            type: 'success'
          })
          setTimeout(()=>{
            setNotification({message: null, type:'error'})
          },5000)
        })
        .catch(error => {
          setNotification({
            message: `${error.response.data.error}`,
            type: 'error'
          }
          )
          setTimeout(()=>{
            setNotification({message: null, type:'error'})
          },5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value.trim().toLowerCase())
  }

  const nameExist = () => {
    return persons.find(person => person.name === newName)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification({
            message: `Deleted ${name}`,
            type: 'error'
          })
          setTimeout(()=>{
            setNotification({message: null, type:'error'})
          },5000)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification content={notificationContent} />
      <Filter handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm handleCreate={handleCreate} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber} />
      <h3>Numbers</h3>
      <Persons persons={persons} searchValue={searchValue} handleDelete={handleDelete} />
    </div>
  )
}

export default App

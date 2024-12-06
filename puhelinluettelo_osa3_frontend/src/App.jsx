import { useState, useEffect } from 'react'
import Persons from "./components/Persons"
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import personService from "./services/persons"

const App = () =>{
  const[persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newFilter, setNewFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState("confirm")
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = persons.filter(person => 
      person.name.toLowerCase().includes(newFilter.toLowerCase())
    ) 

  const addPerson = (event) => {
    event.preventDefault()
    
    const personObject = {
      name: newName,
      number: newNumber
    }

    const changeNumber = () => {
      const personToChange = persons.find(n => n.name === newName)
      const changedPerson = { ...personToChange, number: newNumber }
      
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(personToChange.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personToChange.id ? person : returnedPerson))
          setMessage(
            `Updated ${newName}`
          )
          setStyle("confirm")
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          })
          .catch(error => {
            setMessage(
              `Information of ${newName} has already been removed from server`
            )
            setStyle("error")
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.name !== newName))
          })
      }
    }
    
    persons.some(nameObject => nameObject.name == personObject.name)
    ? changeNumber()
    :
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
    setMessage(
      `Added ${newName}`
    )
    setStyle("confirm")
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    setNewName("")
    setNewNumber("")
  }

  const deletePerson = id => {
    const person = persons.find(n => n.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deleteById(id)
        .then(deletedPerson => {
          setPersons(persons.filter(n => n.id !== id))
        })
      setMessage(
        `Deleted ${person.name}`
      )
      setStyle("confirm")
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return(
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} styleClass={style}/>
      <Filter filterHandle={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm 
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        nameHandle={handleNameChange}
        numberHandle={handleNumberChange}
      />
      <h2>Numbers</h2>
      <div>
        <Persons
          persons={personsToShow}
          deletePerson={deletePerson}
        />
      </div>
    </div>
  )
}

export default App

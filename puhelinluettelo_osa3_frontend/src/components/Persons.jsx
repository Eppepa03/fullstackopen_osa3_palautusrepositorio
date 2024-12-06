const Person = ({person, deletePerson}) => {
    return(
      <>
        <p>{person.name} {person.number}</p>
        <button onClick={deletePerson}>
          delete
        </button>
      </>
    )
  }

const Persons = ({persons, deletePerson}) => {
    return(
      persons.map(person =>
        <Person 
        key={person.name} 
        person={person} 
        deletePerson={() => deletePerson(person.id)}
        />
      )
    )
  }

export default Persons
import React from 'react'

const Persons = ({ persons, searchValue, handleDelete }) => {
    
    const searchResult = searchValue.length > 0 
        ? persons.filter((person) => person.name.toLowerCase().includes(searchValue))
        : persons

    return (
        <div>
            {searchResult.map((person) => (
                <p key={person.id}>{`${person.name} ${person.number}`}
                    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
                </p>
            )
            )}
        </div>
    )
}

export default Persons
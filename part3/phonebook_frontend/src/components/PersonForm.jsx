import React from 'react'

const PersonForm = ({handleCreate, newNumber, newName, handleNameChange, handleNumberChange}) => {
    return (
        <form onSubmit={handleCreate}>
            <div>
                name: <input value={newName} onChange={handleNameChange} required/>
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumberChange} required/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm
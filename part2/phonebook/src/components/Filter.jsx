import React from 'react'

const Filter = ({handleSearchChange}) => {
    return (
        <div>
            filter shown with <input onChange={handleSearchChange} />
        </div>
    )
}

export default Filter
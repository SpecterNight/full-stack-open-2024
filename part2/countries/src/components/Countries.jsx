import React from 'react'

const Countries = ({countries, handleShowCountry}) => {
    return (
        <div>
            {countries.map(country => (
                <p key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => handleShowCountry(country)}>show</button>
                </p>
            ))}
        </div>
    )
}

export default Countries
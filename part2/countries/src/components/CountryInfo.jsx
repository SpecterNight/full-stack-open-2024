import React from 'react'
import Weather from './Weather'

const CountryInfo = ({ country }) => {
  return (
    <div>
      <section>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
      </section>
      <section>
        <h3>languages:</h3>
        <ul>
          {Object.entries(country.languages).map(language =>
            <li key={language[0]} >{language[1]}</li>
          )}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} />
      </section>
      <Weather country={country}/>
    </div>
  )
}

export default CountryInfo
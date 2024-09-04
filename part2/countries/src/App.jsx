import { useEffect, useState } from 'react'
import countryService from './services/countries'
import Countries from './components/Countries'
import CountryInfo from './components/CountryInfo'

const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [filterResults, setFilterResults] = useState([])

  useEffect(() => {
    countryService.getAll()
      .then(allCountries => {
        setCountries(allCountries)
      })
  }, [])


  const handleFilter = event => {
    setSelectedCountry(null)
    const filter = event.target.value.trim().toLowerCase()
    const results = filter 
      ? countries.filter(country => country.name.common.toLowerCase().includes(filter))
      : []
    setFilterResults(results)
  }


  const handleShowCountry = country => setSelectedCountry(country)

  return (
    <div>
      <label >find countries</label>
      <input onChange={handleFilter} />
      {filterResults.length > 10
        ? (<p>Too many matches, specify another filter</p>)
        : filterResults.length === 1 ? <CountryInfo country={filterResults[0]}/>
        : !selectedCountry && <Countries countries={filterResults} handleShowCountry={handleShowCountry}/>
      }
      {selectedCountry && <CountryInfo country={selectedCountry}/>}
    </div>
  )
}

export default App
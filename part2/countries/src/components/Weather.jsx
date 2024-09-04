import { useEffect, useState } from 'react'
import weatherService from '../services/weather'

const Weather = ({country}) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        weatherService.getData(country.latlng[0], country.latlng[1])
        .then(weatherData => {setWeather(weatherData)})
    }, [])

    return weather && (
        <div>
            <h3>Weather in {country.name.common}</h3>
            <p>temperature {weather.main.temp} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}/>
            <p>wind {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather
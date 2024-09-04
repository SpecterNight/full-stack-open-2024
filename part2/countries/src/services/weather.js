import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
const api_key = import.meta.env.VITE_WEATHER_KEY

const getData = (latitude, longitude) => {
    const request = axios.get(`${baseUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`)
    return request.then(response => response.data)
}

export default {getData}
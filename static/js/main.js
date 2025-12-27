console.log('Hello World');

// Clock functionality
function setClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    const secondsDegrees = ((seconds / 60) * 360) + 90;
    const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
    const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

    document.querySelector('.second-hand').style.transform = `rotate(${secondsDegrees}deg)`;
    document.querySelector('.minute-hand').style.transform = `rotate(${minutesDegrees}deg)`;
    document.querySelector('.hour-hand').style.transform = `rotate(${hoursDegrees}deg)`;

    // Update digital time
    const digitalTime = document.getElementById('digital-time');
    if (digitalTime) {
        const timeString = now.toLocaleTimeString();
        digitalTime.innerHTML = `<h4>${timeString}</h4>`;
    }
}

// Weather functionality
function getWeather() {
    // Get user's location using IP geolocation
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const city = data.city;
            const region = data.region;
            
            // Use Open-Meteo API for weather data
            const lat = data.latitude;
            const lon = data.longitude;
            
            return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=auto`);
        })
        .then(response => response.json())
        .then(weatherData => {
            const weatherInfo = document.getElementById('weather-info');
            if (weatherInfo) {
                const temp = weatherData.current.temperature_2m;
                const humidity = weatherData.current.relative_humidity_2m;
                const apparentTemp = weatherData.current.apparent_temperature;
                const weatherCode = weatherData.current.weather_code;
                
                // Weather code mapping from Open-Meteo
                const weatherCodes = {
                    0: '☀️ Clear sky',
                    1: '🌤️ Mainly clear',
                    2: '⛅ Partly cloudy',
                    3: '☁️ Overcast',
                    45: '🌫️ Fog',
                    48: '🌫️ Depositing rime fog',
                    51: '🌦️ Drizzle: Light',
                    53: '🌦️ Drizzle: Moderate',
                    55: '🌧️ Drizzle: Dense intensity',
                    61: '🌧️ Rain: Slight',
                    63: '🌧️ Rain: Moderate',
                    65: '🌧️ Rain: Heavy intensity',
                    71: '🌨️ Snow fall: Slight',
                    73: '🌨️ Snow fall: Moderate',
                    75: '🌨️ Snow fall: Heavy intensity',
                    77: '❄️ Snow grains',
                    80: '🌦️ Rain showers: Slight',
                    81: '🌦️ Rain showers: Moderate',
                    82: '🌧️ Rain showers: Violent',
                    85: '🌨️ Snow showers: Slight',
                    86: '🌨️ Snow showers: Heavy',
                    95: '⛈️ Thunderstorm: Slight or moderate',
                    96: '⛈️ Thunderstorm with slight hail',
                    99: '⛈️ Thunderstorm with heavy hail'
                };
                
                const weatherDescription = weatherCodes[weatherCode] || 'Unknown weather';
                
                weatherInfo.innerHTML = `
                    <div class="weather-icon">${weatherDescription.split(' ')[0]}</div>
                    <p><strong>Location:</strong> ${weatherData.timezone.split('/')[1].replace('_', ' ')}</p>
                    <p><strong>Temperature:</strong> ${temp}°C</p>
                    <p><strong>Feels like:</strong> ${apparentTemp}°C</p>
                    <p><strong>Humidity:</strong> ${humidity}%</p>
                    <p><strong>Weather:</strong> ${weatherDescription.split(' ').slice(1).join(' ')}</p>
                `;
            }
        })
        .catch(error => {
            const weatherInfo = document.getElementById('weather-info');
            if (weatherInfo) {
                weatherInfo.innerHTML = `<p class="text-danger">Failed to load weather data: ${error.message}</p>`;
            }
        });
}

// Initialize clock and weather when page loads
window.addEventListener('load', () => {
    setClock();
    setInterval(setClock, 1000);
    getWeather();
});

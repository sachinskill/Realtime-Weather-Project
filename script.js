// HTML element references
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

// Date and time constants
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// API key
const API_KEY = 'c40ba5eeb25fd0e5e74d266568ec8bde';

// Update time and date every second
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour % 12 || 12; // Converts 24-hour format to 12-hour format
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // Update HTML content
    timeEl.innerHTML = `${hoursIn12HrFormat.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} <span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = `${days[day]}, ${date} ${months[month]}`;
}, 1000);

// Fetch weather data
async function getWeatherData() {
    try {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`);
            const data = await response.json();
            showWeatherData(data);
        }, (error) => {
            console.error('Error getting location', error);
        });
    } catch (error) {
        console.error('Error fetching weather data', error);
    }
}

// Display weather data
function showWeatherData(data) {
    const { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezone.textContent = data.timezone;
    countryEl.textContent = `${data.lat}N ${data.lon}E`;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure} hPa</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_speed} m/s</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
        </div>
    `;

    let otherDayForecast = '';
    data.daily.forEach((day, idx) => {
        if (idx === 0) {
            currentTempEl.innerHTML = `
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">${window.moment(day.dt * 1000).format('dddd')}</div>
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                </div>
            `;
        } else {
            otherDayForecast += `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                </div>
            `;
        }
    });

    weatherForecastEl.innerHTML = otherDayForecast;
}

// Initial call to fetch weather data
getWeatherData();

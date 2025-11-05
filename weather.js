const API_KEY = "80861b32539d49d7819e24b07b70573a";
const BASE_URL = 'https://api.weatherbit.io/v2.0/current';
const CITIES = {
    'Минск': { lat: 53.9045, lon: 27.5615 },
    'Москва': { lat: 55.7558, lon: 37.6173 },
    'Париж': { lat: 48.8566, lon: 2.3522 },
    'Лондон': { lat: 51.5074, lon: -0.1278 },
    'Мадрид': { lat: 40.4168, lon: -3.7038 },
    'Нью-Йорк': { lat: 40.7128, lon: -74.0060 },
    'Пекин': { lat: 39.9042, lon: 116.4074 },
    'Токио': { lat: 35.6762, lon: 139.6503 },
    'Берлин': { lat: 52.5200, lon: 13.4050 },
    'Рим': { lat: 41.9028, lon: 12.4964 }
};
const input = document.getElementById('input');
const showButton = document.getElementById('show');
const container = document.getElementById('container-city');
const cityButtons = document.querySelectorAll('.city-btn');
document.addEventListener('DOMContentLoaded', function() {
    getWeatherByCoords(CITIES['Минск'].lat, CITIES['Минск'].lon, 'Минск');
});
showButton.addEventListener('click', function() {
    const coords = input.value.trim();
    if (coords) {
        const [lat, lon] = coords.split(',').map(coord => coord.trim());
        if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
            getWeatherByCoords(parseFloat(lat), parseFloat(lon));
        } else {
            showError('Некорректные координаты. Используйте формат: широта,долгота');
        }
    } else {
        showError('Введите координаты');
    }
});
cityButtons.forEach(button => {
    button.addEventListener('click', function() {
        const cityName = this.getAttribute('data-city');
        const coords = CITIES[cityName];
        if (coords) {
            getWeatherByCoords(coords.lat, coords.lon, cityName);
        }
    });
});
async function getWeatherByCoords(lat, lon, cityName = null) {
    showLoading();
    
    try {
        const url = `${BASE_URL}?key=${API_KEY}&lat=${lat}&lon=${lon}&lang=ru`;
        const response = await fetch(url);        
        if (!response.ok) {
            throw new Error('Ошибка получения данных');
        }        
        const data = await response.json();        
        if (data.data && data.data.length > 0) {
            const weatherData = data.data[0];
            displayWeather(weatherData, cityName);
        } else {
            throw new Error('Данные о погоде не найдены');
        }
    } catch (error) {
        console.error('Error:', error);
        showError('Ошибка при получении данных о погоде: ' + error.message);
    }
}
function displayWeather(data, customCityName = null) {
    const city = customCityName || data.city_name;
    const temp = Math.round(data.temp);
    const description = data.weather.description;
    const iconCode = data.weather.icon;
    const weatherHTML = `
        <div class="weather-card">
            <div class="city-name">${city}</div>
            <div class="weather-main">
                <div class="temperature">${temp}°C</div>
                <img class="weather-icon" src="https://www.weatherbit.io/static/img/icons/${iconCode}.png" alt="${description}">
            </div>
            <div class="weather-description">${description}</div>
        </div>
    `;
    container.innerHTML = weatherHTML;
    updatePageStyle(description, iconCode);
}
function updatePageStyle(description, iconCode) {
    const body = document.body;    
    body.className = '';
    const descLower = description.toLowerCase();    
    if (descLower.includes('ясно') || descLower.includes('солнечно') || iconCode.includes('c01')) {
        body.classList.add('sunny');
    } else if (descLower.includes('облачно') || descLower.includes('пасмурно') || 
               iconCode.includes('c02') || iconCode.includes('c03') || iconCode.includes('c04')) {
        body.classList.add('cloudy');
    } else if (descLower.includes('дождь') || descLower.includes('ливень') || 
               descLower.includes('гроза') || iconCode.includes('d') || iconCode.includes('r')) {
        body.classList.add('rainy');
    } else if (descLower.includes('снег') || descLower.includes('снегопад') || iconCode.includes('s')) {
        body.classList.add('snowy');
    } else {
        body.classList.add('default');
    }
}
function showLoading() {
    container.innerHTML = '<div class="loading">Загрузка данных о погоде...</div>';
}
function showError(message) {
    container.innerHTML = `<div class="error">${message}</div>`;
}
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        showButton.click();
    }
});
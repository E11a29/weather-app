export const elements = {
  cityInput: document.querySelector('#city-input'),
  searchBtn: document.querySelector('#search-btn'),
  loading: document.querySelector('#loading'),
  error: document.querySelector('#error'),
  weatherDisplay: document.querySelector('#weather-display'),
  cityName: document.querySelector('#city-name'),
  weatherDescription: document.querySelector('#weather-description'),
  temperature: document.querySelector('#temperature'),
  feelsLike: document.querySelector('#feels-like'),
  humidity: document.querySelector('#humidity'),
  pressure: document.querySelector('#pressure'),
  windSpeed: document.querySelector('#wind-speed'),
  visibility: document.querySelector('#visibility'),
  sunrise: document.querySelector('#sunrise'),
  sunset: document.querySelector('#sunset'),
  uvIndex: document.querySelector('#uv-index')
};

export function showLoading() {
  elements.loading.classList.remove('hidden');
  elements.error.classList.add('hidden');
  elements.weatherDisplay.classList.add('hidden');
}

export function hideLoading() {
  elements.loading.classList.add('hidden');
}

export function showError(message) {
  hideLoading();
  elements.error.textContent = message || 'Nu s-au putut încărca datele meteo.';
  elements.error.classList.remove('hidden');
  elements.weatherDisplay.classList.add('hidden');
}


export function displayWeather(weatherData) {
  try {
    hideLoading();
    elements.error.classList.add('hidden');
    
    //numele orașului
    elements.cityName.textContent = weatherData.name;
    
    //descrierea vremii
    elements.weatherDescription.textContent = weatherData.weather[0].description;
    
    //temperatura principală
    elements.temperature.textContent = Math.round(weatherData.main.temp) + '°C';
    
    //senzația termică
    elements.feelsLike.textContent = Math.round(weatherData.main.feels_like) + '°C';
    
    //umiditatea
    elements.humidity.textContent = weatherData.main.humidity + '%';
    
    //presiunea
    elements.pressure.textContent = weatherData.main.pressure + ' mb';
    
    // Convertește viteza vântului din m/s în km/h și actualizează
    const windSpeedKmh = Math.round(weatherData.wind.speed * 3.6);
    elements.windSpeed.textContent = windSpeedKmh + ' km/h';
    
    //convertește din metri în kilometri
    const visibilityKm = weatherData.visibility / 1000;
    elements.visibility.textContent = visibilityKm + ' km';
    
    const sunriseTime = formatUnixTime(weatherData.sys.sunrise);
    elements.sunrise.textContent = sunriseTime;
    
    const sunsetTime = formatUnixTime(weatherData.sys.sunset);
    elements.sunset.textContent = sunsetTime;
    
    // Valoare simulată
    elements.uvIndex.textContent = '5';
    
    elements.weatherDisplay.classList.remove('hidden');
    
  } catch (error) {
    console.log('Eroare la afișarea datelor meteo:', error);
    showError('Eroare la afișarea datelor meteo');
  }
}

export function getCityInput() {
  return elements.cityInput.value.trim();
}

export function clearInput() {
  elements.cityInput.value = '';
}

//formatarea timpului Unix în timp local
function formatUnixTime(unixTime) {
  const date = new Date(unixTime * 1000);
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  
  if (hours.length === 1) {
    hours = '0' + hours;
  }
  if (minutes.length === 1) {
    minutes = '0' + minutes;
  }
  
  return hours + ':' + minutes;
}

export const getElements = () => ({
  cityInput: document.getElementById('cityInput'),
  unitSelect: document.getElementById('unit-select'),
  langSelect: document.getElementById('lang-select'),
  weatherDisplay: document.getElementById('weatherResult')
});

export const updateWeatherUI = (data, cityName) => {
  const container = document.getElementById('weatherResult');
  container.innerHTML = '';

  if (!data || !data.main || !data.weather) {
    container.textContent = `Nu s-au găsit date pentru "${cityName}".`;
    return;
  }

  const city = document.createElement('h2');
  city.textContent = data.name;

  const temp = document.createElement('p');
  const symbol = data.units === 'imperial' ? '°F' : '°C';
  temp.textContent = `Temperatura: ${Math.round(data.main.temp)}${symbol}`;

  const desc = document.createElement('p');
  desc.textContent = `Condiții: ${data.weather[0].description}`;

  container.appendChild(city);
  container.appendChild(temp);
  container.appendChild(desc);
};

export const saveUserPreferences = (unit, lang) => {
  localStorage.setItem('weatherAppPreferences', JSON.stringify({ unit, lang }));
};

export const loadUserPreferences = () => {
  const stored = localStorage.getItem('weatherAppPreferences');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    unit: 'metric',
    lang: 'ro'
  };
};

